import { Moderator } from 'src/moderator/entity/moderator.entity';
import { PaymentMethod, ReqStatus } from 'src/shared/enums/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('withdraw_reqs')
export class WithdrawReq {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => Moderator, (moderator) => moderator.withdraws)
  moderator: Moderator;

  @Column({ nullable: true })
  paymentPhone: string;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column()
  amount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: ReqStatus, default: ReqStatus.PENDING })
  reqStatus: ReqStatus;
}
