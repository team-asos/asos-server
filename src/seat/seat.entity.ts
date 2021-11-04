import { Floor } from 'src/floor/floor.entity';
import { Reservation } from 'src/reservation/reservation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Reservation, reservation => reservation.seat)
  reservation: Reservation;

  @ManyToOne(() => Floor, floor => floor.seats)
  floor: Floor;
}
