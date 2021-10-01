import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Inquire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(() => User, user => user.inquire)
  user: User;
}
