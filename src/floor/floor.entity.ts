import { Facility } from 'src/facility/facility.entity';
import { Room } from 'src/room/room.entity';
import { Seat } from 'src/seat/seat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @OneToMany(() => Seat, seat => seat.floor)
  seats: Seat[];

  @OneToMany(() => Room, room => room.floor)
  rooms: Room[];

  @OneToMany(() => Facility, facility => facility.floor)
  facilities: Facility[];
}
