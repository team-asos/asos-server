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

  @Column({ nullable: true })
  tagId: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @OneToMany(() => Reservation, reservation => reservation.seat, {
    cascade: true,
  })
  reservations: Reservation[];

  @ManyToOne(() => Floor, floor => floor.seats, {
    onDelete: 'CASCADE',
  })
  floor: Floor;
}
