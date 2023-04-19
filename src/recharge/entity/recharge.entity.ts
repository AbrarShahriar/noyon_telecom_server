import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recharges')
export class Recharge {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ default: 0 })
  amount: number;
}
