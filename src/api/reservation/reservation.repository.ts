import * as moment from 'moment';
import { EntityRepository, Repository } from 'typeorm';

import { SearchReservationDto } from './dtos/search-reservation.dto';
import { Reservation } from './reservation.entity';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  async getOneById(reservationId: number): Promise<Reservation> {
    const reservation = await this.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('reservation.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participant')
      .leftJoinAndSelect('seat.floor', 'seat_floor')
      .leftJoinAndSelect('room.floor', 'room_floor')
      .where('reservation.id = (:reservationId)', { reservationId })
      .getOne();

    return reservation;
  }

  async search(search: SearchReservationDto): Promise<Reservation[]> {
    const { userId, seatId, roomId, floorId, status, date } = search;

    const reservations = await this.createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.seat', 'seat')
      .leftJoinAndSelect('reservation.room', 'room')
      .leftJoinAndSelect('reservation.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'participant')
      .leftJoinAndSelect('seat.floor', 'seat_floor')
      .leftJoinAndSelect('room.floor', 'room_floor')
      .where(
        userId
          ? '(reservation.user_id = (:userId) OR participant.id = (:userId))'
          : '1=1',
        { userId },
      )

      .andWhere(seatId ? 'seat.id = (:seatId)' : '1=1', { seatId })
      .andWhere(roomId ? 'room.id = (:roomId)' : '1=1', { roomId })
      .andWhere(floorId ? 'seat_floor.id = (:floorId)' : '1=1', { floorId })
      .andWhere(
        status !== undefined ? 'reservation.status = (:status)' : '1=1',
        {
          status,
        },
      )
      .andWhere(
        date
          ? `DATE(reservation.startTime) BETWEEN "${date} 00:00:00" AND "${date} 23:59:59"`
          : '1=1',
      )
      .getMany();

    return reservations;
  }

  async deleteOneById(reservationId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:reservationId)', { reservationId })
      .execute();
  }

  async updateStatus(): Promise<void> {
    const nowTime = moment(moment.now());

    const reservations = await this.createQueryBuilder('reservation')
      .select([
        'reservation.id',
        'reservation.startTime',
        'reservation.endTime',
      ])
      .leftJoin('reservation.seat', 'seat')
      .where(
        'reservation.seat IS NULL AND (reservation.status = 0 OR reservation.status = 1)',
      )
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
}
