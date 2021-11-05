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
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  maxUser: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @OneToOne(() => Reservation, reservation => reservation.room)
  reservation: Reservation;

  @ManyToOne(() => Floor, floor => floor.rooms)
  floor: Floor;
}
