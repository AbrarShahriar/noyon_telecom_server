import { MembershipBuyReq } from 'src/membership_buy_req/entity/membership_buy_req.entity';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';
import { RechargeBuyReq } from 'src/recharge_buy_req/entity/recharge_buy_req.entity';
import { TopupReq } from 'src/topup_req/entity/topup_req.entity';
import { WithdrawReq } from 'src/withdraw_req/entity/withdraw.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('moderators')
export class Moderator {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ unique: false, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  password: string;

  @OneToMany(() => OfferBuyReq, (offerReq) => offerReq.moderator)
  approvedOfferReqs: OfferBuyReq[];

  @OneToMany(() => RechargeBuyReq, (rechargeReq) => rechargeReq.moderator)
  approvedRechargeReqs: RechargeBuyReq[];

  @OneToMany(() => WithdrawReq, (withdrawReq) => withdrawReq.moderator)
  withdraws: WithdrawReq[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
