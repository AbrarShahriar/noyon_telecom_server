import { Moderator } from 'src/moderator/entity/moderator.entity';
import { PaymentMethod } from 'src/shared/enums/enums';
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedMembershipReqs)
  moderator: Moderator;

  @UpdateDateColumn({ type: 'timestamp' })
  approvedAt!: Date;
}
