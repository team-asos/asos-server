import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { Participant } from 'src/participant/participant.entity';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { RoomRepository } from 'src/room/room.repository';
import { SeatRepository } from 'src/seat/seat.repository';
import { UserRepository } from 'src/user/user.repository';
import { Connection } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoomReservationDto } from './dtos/create-room-reservation.dto';
import { CreateSeatReservationDto } from './dtos/create-seat-reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly seatRepository: SeatRepository,
    private readonly roomRepository: RoomRepository,
    private readonly connection: Connection,
  ) {}

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();

    return reservations;
  }

  async findOne(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.getOneById(
      reservationId,
    );

    return reservation;
  }

  async createRoomOne(
    createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
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

      const savedReservation = await this.reservationRepository.save(
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

          await this.participantRepository.save(participant);
        }),
      );
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

    let reservation = new Reservation();
    reservation = { ...reservation, ...createSeatReservationDto, user, seat };

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

    await this.reservationRepository.deleteOneById(reservationId);
  }
}
