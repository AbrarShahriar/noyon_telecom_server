import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Offer } from 'src/offer/entity/offer.entity';
import { UserHistory } from 'src/user_history/entity/user_history.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('offer_buy_reqs')
export class OfferBuyReq {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ nullable: false })
  phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  approved: boolean;

  @Column({ nullable: true })
  approvedBy: string;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedOfferReqs)
  moderator: Moderator;

  @ManyToOne(() => Offer, (offer) => offer.offerBuyReqs)
  offer: Offer;

  @UpdateDateColumn({ type: 'timestamp' })
  approvedAt!: Date;
}
