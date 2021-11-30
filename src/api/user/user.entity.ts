import { Answer } from 'src/api/answer/answer.entity';
import { Participant } from 'src/api/participant/participant.entity';
import { Question } from 'src/api/question/question.entity';
import { Reservation } from 'src/api/reservation/reservation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  tel: string;

  @Column({ default: 0 })
  role: number;

  @Column()
  employeeId: string;

  @Column()
  department: string;

  @Column()
  position: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Question, question => question.user)
  questions: Question[];

  @OneToMany(() => Answer, answer => answer.user)
  answers: Answer[];

  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];

  @OneToMany(() => Participant, participant => participant.user)
  participants: Participant[];
}
