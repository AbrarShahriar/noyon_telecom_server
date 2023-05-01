import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Offer } from 'src/offer/entity/offer.entity';
import { PaymentMethod, ReqStatus } from 'src/shared/enums/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('topup_reqs')
export class TopupReq {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  userPhone: string;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  paymentMethod: PaymentMethod;

  @Column({ nullable: false })
  paymentPhone: string;

  @Column({ nullable: true })
  transactionId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: ReqStatus, default: ReqStatus.PENDING })
  reqStatus: ReqStatus;

  @UpdateDateColumn({ type: 'timestamptz' })
  actionAt!: Date;
}
