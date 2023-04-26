import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserHistoryType } from '../user_history.enum';

@Entity('user_history')
export class UserHistory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: UserHistoryType })
  historyType: UserHistoryType;

  @Column({ nullable: true })
  desc: string;

  @Column()
  amount: number;

  @Column({ default: 0 })
  saved: number;

  @Column({ nullable: true, default: 'N/A' })
  transactionId: string;

  @Column({ nullable: true })
  reqId: number;

  @CreateDateColumn({ type: 'timestamp' })
  historyDate!: Date;
}
