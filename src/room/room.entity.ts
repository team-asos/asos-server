import { Floor } from 'src/floor/floor.entity';
import { Reservation } from 'src/reservation/reservation.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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

  @OneToMany(() => Reservation, reservation => reservation.room, {
    cascade: true,
  })
  reservations: Reservation[];

  @ManyToOne(() => Floor, floor => floor.rooms, {
    onDelete: 'CASCADE',
  })
  floor: Floor;
}
