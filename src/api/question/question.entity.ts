import { Answer } from 'src/api/answer/answer.entity';
import { User } from 'src/api/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  @Column()
  title: string;

  @Column({ length: 500 })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date;

  @OneToOne(() => Answer, answer => answer.question)
  answer: Answer;

  @ManyToOne(() => User, user => user.questions)
  user: User;
}
