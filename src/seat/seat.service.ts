import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';
import { ReservationRepository } from 'src/reservation/reservation.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateSeatDto } from './seat.dto';
import { Seat } from './seat.entity';
import { SeatRepository } from './seat.repository';
import { Floor } from 'src/floor/floor.entity';
import { FloorRepository } from 'src/floor/floor.repository';

@Injectable()
export class SeatService {
  constructor(
    private seatRepository: SeatRepository,
    private floorRepository: FloorRepository,
  ) {}

  async findAll(): Promise<Seat[]> {
    const seats = await this.seatRepository.find();

    return seats;
  }

  async findOne(userId: number): Promise<Seat> {
    const seat = await this.seatRepository.findOne(userId);

    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_SEAT);

    return seat;
  }

  async createOne(createSeatDto: CreateSeatDto): Promise<void> {
    const { floorId } = createSeatDto;
    const floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);

    let seat = new Seat();

    seat = { ...seat, ...createSeatDto, floor };

    await this.seatRepository.save(seat);
  }

  async deleteOne(seatId: number): Promise<void> {
    const seat = await this.seatRepository.findOne();

    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_SEAT);

    await this.seatRepository.deleteOneById(seatId);
  }
}
