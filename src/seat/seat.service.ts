import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ReservationRepository } from 'src/reservation/reservation.repository';

import { CreateSeatDto } from './seat.dto';
import { Seat } from './seat.entity';
import { SeatRepository } from './seat.repository';

@Injectable()
export class SeatService {
  @InjectRepository(ReservationRepository)
  private readonly reservationRepository: ReservationRepository;

  @InjectRepository(SeatRepository)
  private readonly seatRepository: SeatRepository;

  async findAll(): Promise<Seat[]> {
    const seats = await this.seatRepository.find();

    return seats;
  }

  async findOne(reservationId: number): Promise<Seat> {
    const seat = await this.seatRepository.findOne(reservationId);

    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    return seat;
  }

  async createOne(CreateSeatDto: CreateSeatDto): Promise<void> {
    const { reservationId } = CreateSeatDto;

    const reservation = await this.reservationRepository.findOne(reservationId);
    if (reservation === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);
    const seat = new Seat();
    seat.reservations = [reservation];
  }

  async deleteOne(seatId: number): Promise<void> {
    const seat = await this.seatRepository.findOne();
    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_SEAT);
    await this.seatRepository.deleteOneById(seatId);
  }
}
