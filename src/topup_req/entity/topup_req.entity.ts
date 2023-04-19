import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Offer } from 'src/offer/entity/offer.entity';
import { PaymentMethod } from 'src/shared/enums/enums';
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedTopupReqs)
  moderator: Moderator;

  @UpdateDateColumn({ type: 'timestamp' })
  approvedAt!: Date;
}
