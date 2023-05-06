import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OfferCategory, OfferType, SIMCARD } from '../offer.enums';
import { OfferBuyReq } from 'src/offer_buy_req/entity/offer_buy_req.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  desc?: string;

  @Column({ type: 'enum', enum: OfferCategory, nullable: true })
  category: OfferCategory;

  @Column({ type: 'enum', enum: SIMCARD, nullable: true })
  simcard: SIMCARD;

  @Column({
    type: 'enum',
    enum: OfferType,
    nullable: true,
    default: OfferType.REGULAR,
  })
  type: OfferType;

  @Column({
    default: false,
  })
  isPremium: boolean;

  @Column({ default: 0 })
  regularPrice: number;

  @Column({ default: 0 })
  discountPrice: number;

  @Column({ default: 0 })
  adminPrice: number;

  @Column({ nullable: true })
  expiration: string;

  @OneToMany(() => OfferBuyReq, (offerBuyReq) => offerBuyReq.offer)
  offerBuyReqs: OfferBuyReq[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ default: true })
  showOffer: boolean;
}
