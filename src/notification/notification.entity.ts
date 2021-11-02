import { Inquire } from 'src/inquire/inquire.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  read: boolean;

  @Column({ default: false })
  trash: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Inquire, inquire => inquire.notification)
  inquire: Inquire;
}
