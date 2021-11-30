import { Floor } from 'src/api/floor/floor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { FacilityType } from './enums/facility-type.enum';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  x: number;

  @Column()
  y: number;

  @Column({
    type: 'enum',
    enum: FacilityType,
    default: FacilityType.AIRCONDITIONAL,
  })
  type: FacilityType;

  @Column()
  width: number;

  @Column()
  height: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @ManyToOne(() => Floor, floor => floor.facilities, {
    onDelete: 'CASCADE',
  })
  floor: Floor;
}
