import { Floor } from 'src/floor/floor.entity';
import { EntityRepository, Repository } from 'typeorm';

import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  async getOneById(reservationId: number): Promise<Reservation> {
    const reservation = await this.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('seat.floor', 'seat.floor')
      .leftJoinAndSelect('room.floor', 'room.floor')
      .where('reservation.id = (:reservationId)', { reservationId })
      .getOne();

    return reservation;
  }

  async deleteOneById(reservationId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:reservationId)', { reservationId })
      .execute();
  }
}
