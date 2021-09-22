import { EntityRepository, Repository } from 'typeorm';

import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {}
