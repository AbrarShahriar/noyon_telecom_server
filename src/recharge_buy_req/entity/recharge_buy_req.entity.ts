import { Moderator } from 'src/moderator/entity/moderator.entity';
import { ReqStatus } from 'src/shared/enums/enums';
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'enum', enum: ReqStatus, default: ReqStatus.PENDING })
  reqStatus: ReqStatus;

  @Column({ nullable: true })
  actionBy: string;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedRechargeReqs)
  moderator: Moderator;

  @UpdateDateColumn({ type: 'timestamptz' })
  actionAt!: Date;
}
