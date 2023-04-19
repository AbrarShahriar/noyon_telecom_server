import { Moderator } from 'src/moderator/entity/moderator.entity';
import { Offer } from 'src/offer/entity/offer.entity';
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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ default: false })
  approved: boolean;

  @ManyToOne(() => Moderator, (moderator) => moderator.approvedOfferReqs)
  moderator: Moderator;

  @ManyToOne(() => Offer, (offer) => offer.offerBuyReqs)
  offer: Offer;

  @UpdateDateColumn({ type: 'timestamp' })
  approvedAt!: Date;
}
