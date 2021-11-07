import { EntityRepository, Repository } from 'typeorm';

import { Seat } from './seat.entity';

@EntityRepository(Seat)
export class SeatRepository extends Repository<Seat> {
  async deleteOneById(seatId: number): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where('id = (:seatId)', { seatId })
      .execute();
  }
}
