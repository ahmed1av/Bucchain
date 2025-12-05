import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('tracking')
export class Tracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  location: string;

  @Column()
  status: string;

  @Column()
  timestamp: Date;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Product, (product) => product.tracking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @CreateDateColumn()
  createdAt: Date;
}
