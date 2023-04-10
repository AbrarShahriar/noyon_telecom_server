import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Subscription } from '../user.enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: false, nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ unique: false, nullable: true })
  pin: string;

  @Column({ default: 0 })
  balance: number;

  @Column({
    type: 'enum',
    enum: Subscription,
    default: Subscription.REGULAR,
  })
  subscription: Subscription;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
