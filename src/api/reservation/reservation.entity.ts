import { Participant } from 'src/api/participant/participant.entity';
import { Room } from 'src/api/room/room.entity';
import { Seat } from 'src/api/seat/seat.entity';
import { User } from 'src/api/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ default: '' })
  topic: string;

  @Column({ default: 0 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Participant, participant => participant.reservation, {
    cascade: true,
  })
  participants: Participant[];

  @ManyToOne(() => Seat, seat => seat.reservations, {
    onDelete: 'CASCADE',
  })
  seat: Seat;

  @ManyToOne(() => Room, room => room.reservations, {
    onDelete: 'CASCADE',
  })
  room: Room;

  @ManyToOne(() => User, user => user.reservations)
  user: User;
}
