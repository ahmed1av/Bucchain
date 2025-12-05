import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Tracking } from './tracking.entity';
import { Review } from './review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @Column()
  status: string;

  @Column()
  location: string;

  @Column({ unique: true })
  trackingId: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column()
  supplierId: string;

  @OneToMany(() => Tracking, (tracking) => tracking.product)
  tracking: Tracking[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
