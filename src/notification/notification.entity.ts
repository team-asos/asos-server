import { Question } from 'src/question/question.entity';
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

  @OneToOne(() => Question, question => question.notification)
  question: Question;
}
