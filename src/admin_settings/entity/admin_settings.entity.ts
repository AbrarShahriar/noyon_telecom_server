import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('admin_settings')
export class AdminSetting {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  label: string;

  @Column()
  value: string;
}
