import { Participant } from 'src/participant/participant.entity';
import { Room } from 'src/room/room.entity';
import { Seat } from 'src/seat/seat.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Participant, participant => participant.reservation)
  participants: Participant[];

  @ManyToOne(() => Seat, seat => seat.reservations)
  seat: Seat;

  @ManyToOne(() => Room, room => room.reservations)
  room: Room;

  @ManyToOne(() => User, user => user.reservations)
  user: User;
}
