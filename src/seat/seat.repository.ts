import { EntityRepository, Repository } from 'typeorm';

import { Seat } from './seat.entity';

@EntityRepository(Seat)
export class SeatRepository extends Repository<Seat> {
  async getSeatByEmail(email: string): Promise<Seat | undefined> {
    const seat = await this.createQueryBuilder('seat')
      .where('user.email = (:email)', { email })
      .getOne();
    return seat;
  }
  async deleteOneById(seatId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:seatId)', { seatId })
      .execute();
  }
}
