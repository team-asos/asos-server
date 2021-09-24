import { Seat } from 'src/seat/seat.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Seat, seat => seat.reservations)
  seat: Seat;
}
