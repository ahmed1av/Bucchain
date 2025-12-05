import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (user) {
      const { password, refreshToken, ...result } = user; // ✅ إضافة refreshToken
      return result;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'user',
    });

    await this.usersRepository.save(user);

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.getTokens(user);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return {
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async logout(userId: string) {
    return await this.usersRepository.update(userId, { refreshToken: null });
  }

  async refreshTokensFromCookie(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret', // ✅ إضافة secret
      });
      return this.refreshTokens(payload.sub, refreshToken);
    } catch (e) {
      console.error('Refresh token verification failed:', e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    console.log('Refreshing tokens for user:', userId);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET || 'secret', // ✅ إضافة secret
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret', // ✅ إضافة secret
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password, refreshToken, ...result } = user;
    return result;
  }
}
