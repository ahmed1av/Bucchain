import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude() // Exclude password from JSON responses
  password: string;

  @Column()
  name: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'text', nullable: true })
  @Exclude()
  refreshToken: string | null;

  @ManyToMany(() => Product)
  @JoinTable({ name: 'user_wishlist' })
  wishlist: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
