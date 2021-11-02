import { Notification } from 'src/notification/notification.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Inquire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  status: number;

  @Column({ length: 500 })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, user => user.inquire)
  user: User;

  @OneToOne(() => Notification, notification => notification.inquire)
  @JoinColumn()
  notification: Notification;
}
