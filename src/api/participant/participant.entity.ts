import { Reservation } from 'src/api/reservation/reservation.entity';
import { User } from 'src/api/user/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.participants)
  user: User;

  @ManyToOne(() => Reservation, reservation => reservation.participants, {
    onDelete: 'CASCADE',
  })
  reservation: Reservation;
}
