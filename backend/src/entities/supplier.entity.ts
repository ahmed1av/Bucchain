import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { Contract } from './contract.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column('decimal', { precision: 3, scale: 1 })
  rating: number;

  @Column()
  productTypes: string; // غيرنا الاسم من products ل productTypes

  @Column()
  status: string;

  @Column()
  contactEmail: string;

  @Column()
  phone: string;

  @OneToMany(() => Product, (product) => product.supplier, { cascade: true })
  products: Product[];

  @OneToMany(() => Order, (order) => order.supplier)
  orders: Order[];

  @OneToMany(() => Contract, (contract) => contract.supplier)
  contracts: Contract[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
