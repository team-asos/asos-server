import { Reservation } from 'src/reservation/reservation.entity';
import { Room } from 'src/room/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Reservation, reservation => reservation.seat)
  reservations: Reservation[];

  @ManyToOne(() => Room, room => room.seats)
  room: Room;
}
