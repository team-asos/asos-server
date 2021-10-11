import { EntityRepository, Repository } from 'typeorm';

import { Seat } from './seat.entity';

@EntityRepository(Seat)
export class SeatRepository extends Repository<Seat> {}
