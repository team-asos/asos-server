import { EntityRepository, Repository } from 'typeorm';

import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  async deleteOneById(reservationId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:reservationId)', { reservationId })
      .execute();
  }
}
