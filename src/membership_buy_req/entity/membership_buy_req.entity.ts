import { Moderator } from 'src/moderator/entity/moderator.entity';
import { PaymentMethod, ReqStatus } from 'src/shared/enums/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('membership_buy_reqs')
export class MembershipBuyReq {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: false })
  userPhone: string;

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column()
  paymentPhone: string;

  @Column()
  transactionId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: ReqStatus, default: ReqStatus.PENDING })
  reqStatus: ReqStatus;

  @Column({ nullable: true })
  actionBy: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  actionAt!: Date;
}
