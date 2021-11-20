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

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @OneToMany(() => Seat, seat => seat.floor, {
    cascade: true,
  })
  seats: Seat[];

  @OneToMany(() => Room, room => room.floor, {
    cascade: true,
  })
  rooms: Room[];

  @OneToMany(() => Facility, facility => facility.floor, {
    cascade: true,
  })
  facilities: Facility[];
}
