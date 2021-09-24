import { Reservation } from 'src/reservation/reservation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column()
  tel: string;

  @Column()
  auth: number;

  @Column()
  dept: string;

  @Column()
  job: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];
}
