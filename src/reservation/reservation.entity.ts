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
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reservationTime: number;

  @Column()
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, user => user.reservations)
  user: User;

  @OneToOne(() => Seat, seat => seat.reservation)
  @JoinColumn()
  seat: Seat;

  @OneToOne(() => Room, room => room.reservation)
  @JoinColumn()
  room: Room;
}
