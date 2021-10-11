import { EntityRepository, Repository } from 'typeorm';

import { Floor } from './floor.entity';

@EntityRepository(Floor)
export class FloorRepository extends Repository<Floor> {}
