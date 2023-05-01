import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  desc?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
