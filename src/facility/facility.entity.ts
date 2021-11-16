import { Floor } from 'src/floor/floor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum FacilityType {
  AIR = 'air',
  PAN = 'pan',
  TOLIET = 'toliet',
  DOOR = 'door',
  ELEVATOR = 'elevator',
  STAIR = 'stair',
}
@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: FacilityType,
    default: [
      FacilityType.AIR,
      FacilityType.PAN,
      FacilityType.ELEVATOR,
      FacilityType.DOOR,
      FacilityType.STAIR,
      FacilityType.TOLIET,
    ],
  })
  @Column()
  x: number;

  @Column()
  y: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @ManyToOne(() => Floor, floor => floor.facilities)
  floor: Floor;
}
