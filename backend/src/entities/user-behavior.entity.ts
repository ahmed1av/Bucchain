import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_behavior')
export class UserBehavior {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // 'view_product', 'add_to_cart', 'search', etc.

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Store related IDs (productId, etc.) or search terms

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  sessionId: string; // For anonymous users

  @CreateDateColumn()
  timestamp: Date;
}
