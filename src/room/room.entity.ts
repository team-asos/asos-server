import { Facility } from 'src/facility/facility.entity';
import { Floor } from 'src/floor/floor.entity';
import { Seat } from 'src/seat/seat.entity';
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
  type: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Seat, seat => seat.room)
  seats: Seat[];

  @OneToMany(() => Facility, facility => facility.room)
  facilities: Facility[];

  @ManyToOne(() => Floor, floor => floor.rooms)
  floor: Floor;
}
