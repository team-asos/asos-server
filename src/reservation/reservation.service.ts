import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateReservationDto } from './reservation.dto';
import { Reservation } from './reservation.entity';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  @InjectRepository(ReservationRepository)
  private readonly reservationRepository: ReservationRepository;

  async findAll(): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find();

    return reservations;
  }

  async createOne(createReservationDto: CreateReservationDto): Promise<void> {
    const { userId } = createReservationDto;

    const user = await this.userRepository.findOne(userId);
    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    let reservation = new Reservation();
    reservation = { ...reservation, ...createReservationDto };

    await this.reservationRepository.save(reservation);

    return;
  }
}
