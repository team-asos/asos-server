import { Participant } from 'src/participant/participant.entity';
import { Room } from 'src/room/room.entity';
import { Seat } from 'src/seat/seat.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => Seat, seat => seat.reservation)
  @JoinColumn()
  seat: Seat;

  @OneToOne(() => Room, room => room.reservation)
  @JoinColumn()
  room: Room;

  @OneToMany(() => Participant, participant => participant.reservation)
  participants: Participant[];

  @ManyToOne(() => User, user => user.reservations)
  user: User;
}
