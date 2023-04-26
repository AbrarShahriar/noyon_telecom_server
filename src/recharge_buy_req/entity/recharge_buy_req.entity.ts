import { Moderator } from 'src/moderator/entity/moderator.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('recharge_buy_reqs')
export class RechargeBuyReq {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: false })
  phone: string;

  @Column()
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedRechargeReqs)
  moderator: Moderator;

  @UpdateDateColumn({ type: 'timestamp' })
  approvedAt!: Date;
}
