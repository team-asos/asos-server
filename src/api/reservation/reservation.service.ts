import * as moment from 'moment';
import { Participant } from 'src/api/participant/participant.entity';
import { RoomRepository } from 'src/api/room/room.repository';
import { SeatRepository } from 'src/api/seat/seat.repository';
import { UserRepository } from 'src/api/user/user.repository';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { getConnection } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoomReservationDto } from './dtos/create-room-reservation.dto';
import { CreateSeatReservationDto } from './dtos/create-seat-reservation.dto';
import { SearchReservationDto } from './dtos/search-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly seatRepository: SeatRepository,
    private readonly roomRepository: RoomRepository,
  ) {}

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();

    return reservations;
  }

  async searchAll(search: SearchReservationDto): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.search(search);

    return reservations;
  }

  async findOne(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.getOneById(
      reservationId,
    );

    return reservation;
  }

  async findRoomTable(
    roomId: number,
    search: SearchReservationDto,
  ): Promise<Reservation[]> {
    const { date } = search;

    const reservations = await this.reservationRepository.search({
      roomId,
      date,
    });

    const today = moment(`${date}`).toDate();

    let table: any = [
      {
        start_time: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          8,
          0,
          0,
        ),
        end_time: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          8,
          30,
          0,
        ),
      },
    ];

    const end_time = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      17,
      30,
      0,
    );

    while (true) {
      const last = table[table.length - 1];
      if (moment(last.start_time).diff(end_time) === 0) break;

      table.push({
        start_time: moment(last.start_time).add(30, 'minutes').toDate(),
        end_time: moment(last.end_time).add(30, 'minutes').toDate(),
      });
    }

    table = table.map(row => {
      const index = reservations.findIndex(
        reservation =>
          row.start_time >= reservation.startTime &&
          row.start_time < reservation.endTime,
      );

      if (index !== -1) return { ...row, ...reservations[index] };
      else return { ...row };
    });

    return table;
  }

  async createRoomOne(
    createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<void> {
    const queryRunner = getConnection().createQueryRunner();

    await queryRunner.startTransaction();

    try {
      const { userId, participantIds, roomId } = createRoomReservationDto;

      const user = await this.userRepository.findOne(userId);
      if (user === undefined)
        throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

      const room = await this.roomRepository.findOne(roomId);
      if (room === undefined)
        throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_ROOM);

      let reservation = new Reservation();
      reservation = { ...reservation, ...createRoomReservationDto, user, room };

      const savedReservation = await queryRunner.manager.save(
        Reservation,
        reservation,
      );

      await Promise.all(
        participantIds.map(async participantId => {
          const user = await this.userRepository.findOne(participantId);
          if (user === undefined)
            throw new HttpError(
              HttpStatus.NOT_FOUND,
              HttpMessage.NOT_FOUND_PARTICIPANT,
            );

          const participant = new Participant();
          participant.user = user;
          participant.reservation = savedReservation;

          await queryRunner.manager.save(Participant, participant);
        }),
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_SAVE_RESERVATION,
      );
    } finally {
      await queryRunner.release();
    }

    return;
  }

  async createSeatOne(
    createSeatReservationDto: CreateSeatReservationDto,
  ): Promise<void> {
    const { userId, seatId } = createSeatReservationDto;

    const user = await this.userRepository.findOne(userId);
    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    const seat = await this.seatRepository.findOne(seatId);
    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_SEAT);

    // 예약자가 기존 예약한 좌석이 있는지 확인
    const prevReservations = await this.reservationRepository.find({
      user,
      room: null,
      status: 1,
    });

    if (prevReservations.length !== 0) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_SAVE_RESERVATION,
      );
    }

    // 예약하려는 좌석이 이미 예약 되어 있는지 확인
    const duplicatedReservations = await this.reservationRepository.find({
      seat,
      status: 1,
    });

    if (duplicatedReservations.length !== 0) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_SAVE_RESERVATION,
      );
    }

    let reservation = new Reservation();
    reservation = {
      ...reservation,
      startTime: moment(moment.now()).toDate(),
      user,
      seat,
      status: 1,
    };

    await this.reservationRepository.save(reservation);

    return;
  }

  async updateSeatOne(reservationId: number): Promise<void> {
    let reservation = await this.reservationRepository.findOne(reservationId);

    if (reservation === undefined)
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND_RESERVATION,
      );

    reservation = {
      ...reservation,
      endTime: moment(moment.now()).toDate(),
      status: 2,
    };

    await this.reservationRepository.save(reservation);

    return;
  }

  async deleteOne(reservationId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne(reservationId);

    if (reservation === undefined)
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND_RESERVATION,
      );
    try {
      await this.reservationRepository.deleteOneById(reservationId);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_DELETE_RESERVATION,
      );
    }

    return;
  }
}
