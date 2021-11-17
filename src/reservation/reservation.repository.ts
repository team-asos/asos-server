import * as moment from 'moment';
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
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('seat.floor', 'seat.floor')
      .leftJoinAndSelect('room.floor', 'room.floor')
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

  async updateReservationStatus(): Promise<void> {
    const nowTime = moment(new Date());

    const reservations = await this.createQueryBuilder('reservation')
      .select([
        'reservation.id',
        'reservation.startTime',
        'reservation.endTime',
      ])
      .getMany();

    reservations.map(async reservation => {
      const startTime = moment(reservation.startTime);
      const endTime = moment(reservation.endTime);

      const isStart = startTime <= nowTime && endTime >= nowTime;
      const isEnd = endTime < nowTime;

      if (isStart || isEnd) {
        const target = await this.createQueryBuilder('reservation')
          .where('reservation.id = (:reservationId)', {
            reservationId: reservation.id,
          })
          .getOne();

        if (isStart) target.status = 1;
        else if (isEnd) target.status = 2;

        await this.save(target);
      }
    });

    return;
  }

  async parseReservation(): Promise<any> {
    const reservations = await this.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('seat.floor', 'seat.floor')
      .leftJoinAndSelect('room.floor', 'room.floor')
      .select([
        'reservation.startTime',
        'reservation.endTime',
        'reservation.status',
        'user.name',
        'user.tel',
        'user.department',
        'seat.name',
        'seat.tagId',
        'seat.floor.name',
        'room.name',
        'room.tagId',
        'room.floor.name',
      ])
      .where('reservation.status = 1')
      .getMany();

    return reservations;
  }
}
