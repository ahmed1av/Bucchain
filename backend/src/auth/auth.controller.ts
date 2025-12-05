import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtService } from '@nestjs/jwt';

// ✅ أضف Interface للـ User
interface JwtPayload {
  userId: string;
  email?: string;
  sub?: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    // ✅ تصحيح نوع الإرجاع
    const result = await this.authService.register(registerDto);
    this.setRefreshTokenCookie(res, result.refresh_token);
    const { refresh_token, ...response } = result;
    return response;
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    // ✅ تصحيح نوع الإرجاع
    const result = await this.authService.login(loginDto);
    this.setRefreshTokenCookie(res, result.refresh_token);
    const { refresh_token, ...response } = result;
    return response;
  }

  @Public()
  @SkipThrottle()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponseDto, 'refresh_token'>> {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      // Ensure userId is defined
      const userId = payload.userId || payload.sub;
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // Refresh tokens using the service
      const result = await this.authService.refreshTokens(userId, refreshToken);

      this.setRefreshTokenCookie(res, result.refresh_token);
      const { refresh_token, ...response } = result;
      return response;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const userId = user.userId || user.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid user');
    }
    await this.authService.logout(userId);
    res.clearCookie('refresh_token');
    return { message: 'Logged out successfully' };
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    const userId = user.userId || user.sub;
    if (!userId) {
      throw new UnauthorizedException('Invalid user');
    }
    return this.authService.getUserProfile(userId);
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
      path: '/auth/refresh',
    });
  }
}
