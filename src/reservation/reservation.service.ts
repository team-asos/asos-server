import HttpError from 'src/common/exceptions/http.exception';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import { Participant } from 'src/participant/participant.entity';
import { ParticipantRepository } from 'src/participant/participant.repository';
import { UserRepository } from 'src/user/user.repository';
import { Connection } from 'typeorm';

import { HttpStatus, Injectable } from '@nestjs/common';

import {
  CreateRoomReservationDto,
  CreateSeatReservationDto,
} from './reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly participantRepository: ParticipantRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly connection: Connection,
  ) {}

  async findAll(): Promise<Reservation[] | undefined> {
    const reservations = await this.reservationRepository.find();

    return reservations;
  }

  async createRoomOne(
    createRoomReservationDto: CreateRoomReservationDto,
  ): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, participantIds } = createRoomReservationDto;

      const user = await this.userRepository.findOne(userId);
      if (user === undefined)
        throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

      let reservation = new Reservation();
      reservation = { ...reservation, ...createRoomReservationDto, user };

      const savedReservation = await this.reservationRepository.save(
        reservation,
      );

      await Promise.all(
        participantIds.map(async participantId => {
          const user = await this.userRepository.findOne(participantId);
          if (user === undefined)
            throw new HttpError(
              HttpStatus.NOT_FOUND,
              ErrorMessage.NOT_FOUND_PARTICIPANT,
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
        ErrorMessage.FAIL_SAVE_RESERVATION,
      );
    } finally {
      await queryRunner.release();
    }

    return;
  }

  async createSeatOne(
    createSeatReservationDto: CreateSeatReservationDto,
  ): Promise<void> {
    const { userId } = createSeatReservationDto;

    const user = await this.userRepository.findOne(userId);
    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    let reservation = new Reservation();
    reservation = { ...reservation, ...createSeatReservationDto, user };

    await this.reservationRepository.save(reservation);

    return;
  }
}
