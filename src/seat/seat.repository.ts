import { EntityRepository, Repository } from 'typeorm';

import { Seat } from './seat.entity';

@EntityRepository(Seat)
export class SeatRepository extends Repository<Seat> {
  async getMany(): Promise<Seat[]> {
    const seats = await this.createQueryBuilder('seat')
      .leftJoinAndSelect('seat.floor', 'floor')
      .getMany();

    return seats;
  }

  async getOneById(seatId: number): Promise<Seat> {
    const seat = await this.createQueryBuilder('seat')
      .leftJoinAndSelect('seat.floor', 'floor')
      .where('seat.id = (:seatId)', { seatId })
      .getOne();

    return seat;
  }

  async deleteOneById(seatId: number): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where('id = (:seatId)', { seatId })
      .execute();
  }
}
