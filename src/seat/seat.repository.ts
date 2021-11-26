import { EntityRepository, Repository } from 'typeorm';

import { SearchSeatDto } from './dtos/search-seat.dto';
import { Seat } from './seat.entity';

@EntityRepository(Seat)
export class SeatRepository extends Repository<Seat> {
  async getMany(): Promise<Seat[]> {
    const seats = await this.createQueryBuilder('seat')
      .leftJoinAndSelect('seat.floor', 'floor')
      .getMany();

    return seats;
  }

  async search(search: SearchSeatDto): Promise<Seat[]> {
    const { floorId } = search;

    const seats = await this.createQueryBuilder('seat')
      .where(floorId ? 'seat.floor_id = (:floorId)' : '1=1', { floorId })
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

  async parseSeat(): Promise<Seat[]> {
    const seats = await this.createQueryBuilder('seat')
      .leftJoin('seat.floor', 'floor')
      .leftJoin('seat.reservations', 'reservations')
      .leftJoin('reservations.user', 'user')
      .select([
        'user.name',
        'user.tel',
        'user.department',
        'user.position',
        'seat.name',
        'seat.tagId',
        'floor.name',
        'reservations.id',
        'reservations.startTime',
      ])
      .where('seat.tagId IS NOT NULL')
      .andWhere('reservations.status = 1')
      .getMany();

    return seats;
  }
}
