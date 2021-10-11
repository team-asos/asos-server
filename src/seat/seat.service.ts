import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';
import { FloorRepository } from 'src/floor/floor.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateSeatDto } from './seat.dto';
import { Seat } from './seat.entity';
import { SeatRepository } from './seat.repository';

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

  async findOne(seatId: number): Promise<Seat> {
    const seat = await this.seatRepository.findOne(seatId);

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

    return;
  }
}
