import { Room } from 'src/room/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Room, room => room.facilities)
  room: Room;
}
