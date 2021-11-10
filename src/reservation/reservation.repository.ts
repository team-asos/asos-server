import { EntityRepository, Repository } from 'typeorm';

import { SearchReservationDto } from './dtos/search-reservation.dto';
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

  async search(search: SearchReservationDto): Promise<Reservation[]> {
    const { userId } = search;

    const reservations = await this.createQueryBuilder('reservation')
      .where(userId ? 'reservation.user_id = (:userId)' : '1=1', { userId })
      .getMany();

    return reservations;
  }

  async deleteOneById(reservationId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:reservationId)', { reservationId })
      .execute();
  }
}
