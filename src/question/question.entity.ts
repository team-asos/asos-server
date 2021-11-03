import { Notification } from 'src/notification/notification.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Question {
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

  @ManyToOne(() => User, user => user.questions)
  user: User;

  @OneToOne(() => Notification, notification => notification.question)
  @JoinColumn()
  notification: Notification;
}
