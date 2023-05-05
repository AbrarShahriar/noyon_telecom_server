import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Offer } from 'src/offer/entity/offer.entity';
import { ReqStatus } from 'src/shared/enums/enums';
import { UserHistory } from 'src/user_history/entity/user_history.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity('offer_buy_reqs')
export class OfferBuyReq {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: true })
  sendTo: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ enum: ReqStatus, type: 'enum', default: ReqStatus.PENDING })
  reqStatus: ReqStatus;

  @Column({ nullable: true })
  actionBy: string;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedOfferReqs)
  moderator: Moderator;

  @ManyToOne(() => Offer, (offer) => offer.offerBuyReqs)
  offer: Offer;

  @UpdateDateColumn({ type: 'timestamptz' })
  actionAt!: Date;
}
