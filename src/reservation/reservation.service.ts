import * as moment from 'moment';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { Participant } from 'src/participant/participant.entity';
import { RoomRepository } from 'src/room/room.repository';
import { SeatRepository } from 'src/seat/seat.repository';
import { UserRepository } from 'src/user/user.repository';
import { getConnection } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoomReservationDto } from './dtos/create-room-reservation.dto';
import { CreateSeatReservationDto } from './dtos/create-seat-reservation.dto';
import { SearchReservationDto } from './dtos/search-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';
import { ParticipantRepository } from 'src/participant/participant.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly seatRepository: SeatRepository,
    private readonly roomRepository: RoomRepository,
    private readonly participantRepository: ParticipantRepository,
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

  async findRoomTable(roomId: number): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.search({ roomId });

    const today = moment().toDate();

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
          row.start_time <= reservation.startTime &&
          row.end_time >= reservation.startTime,
      );

      if (index !== -1) return { ...reservations[index] };
      else return {};
    });

    return table;
  }

  async createRoomOne(
    createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<void> {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    let userCount = 1;

    try {
      const { userId, participantIds, roomId } = createRoomReservationDto;

      const user = await this.userRepository.findOne(userId);
      if (user === undefined)
        throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

      const room = await this.roomRepository.findOne(roomId);
      if (room === undefined)
        throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_ROOM);

      // 예약자가 기존 예약한 회의실이 있는 지 확인
      const prevRoomReservations = await this.reservationRepository.find({
        user,
        seat: null,
      });

      if (prevRoomReservations.length !== 0) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          HttpMessage.FAIL_SAVE_RESERVATION,
        );
      }

      // 예약하려는 회의실이 이미 예약 되어 있는지 확인
      const duplicatedRoomReservations = await this.reservationRepository.find({
        room,
      });

      if (duplicatedRoomReservations.length !== 0) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          HttpMessage.FAIL_SAVE_RESERVATION,
        );
      }

      //예약된 참석자가 예약을 할려는 경우
      const prevRoomParticipants = await this.participantRepository.find({
        user,
      });
      if (prevRoomParticipants.length !== 0) {
        throw new HttpError(
          HttpStatus.BAD_REQUEST,
          HttpMessage.FAIL_SAVE_RESERVATION,
        );
      }

      let reservation = new Reservation();
      reservation = {
        ...reservation,
        ...createRoomReservationDto,
        user,
        room,
      };

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

          //예약자와 기존 예약된 참석자가 있는 지 확인
          const prevParticipantReservations =
            await this.participantRepository.find({
              user,
            });

          if (prevParticipantReservations.length !== 0) {
            throw new HttpError(
              HttpStatus.BAD_REQUEST,
              HttpMessage.FAIL_SAVE_RESERVATION,
            );
          }

          //예약하려는 참석자가 이미 예약 되어 있는지 확인
          const duplicatedParticipantReservations =
            await this.participantRepository.find({
              reservation,
              user,
            });

          if (duplicatedParticipantReservations.length !== 0) {
            throw new HttpError(
              HttpStatus.BAD_REQUEST,
              HttpMessage.FAIL_SAVE_RESERVATION,
            );
          }

          const participant = new Participant();

          participant.user = user;
          participant.reservation = savedReservation;

          if (participant.user !== null) userCount += 1;

          if (reservation.room.maxUser < userCount)
            throw new HttpError(
              HttpStatus.NOT_FOUND,
              HttpMessage.FAIL_SAVE_RESERVATION,
            );

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
      ...createSeatReservationDto,
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
