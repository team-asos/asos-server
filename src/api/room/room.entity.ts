import { Floor } from 'src/api/floor/floor.entity';
import { Reservation } from 'src/api/reservation/reservation.entity';
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

  @Column({ unique: true, nullable: false, default: 20000 })
  tagId: number;

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
