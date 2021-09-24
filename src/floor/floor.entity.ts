import { Room } from 'src/room/room.entity';
import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Floor {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Room, room => room.floor)
  rooms: Room[];
}
