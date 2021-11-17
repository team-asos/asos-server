import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { FloorRepository } from 'src/floor/floor.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateSeatDto } from './dtos/create-seat.dto';
import { SearchSeatDto } from './dtos/search-seat.dto';
import { UpdateSeatDto } from './dtos/update-seat.dto';
import { Seat } from './seat.entity';
import { SeatRepository } from './seat.repository';

@Injectable()
export class SeatService {
  constructor(
    private seatRepository: SeatRepository,
    private floorRepository: FloorRepository,
  ) {}

  async findAll(): Promise<Seat[]> {
    const seats = await this.seatRepository.getMany();

    return seats;
  }

  async searchAll(search: SearchSeatDto): Promise<Seat[]> {
    const seats = await this.seatRepository.search(search);

    return seats;
  }

  async findOne(seatId: number): Promise<Seat> {
    const seat = await this.seatRepository.getOneById(seatId);

    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_SEAT);

    return seat;
  }

  async createOne(createSeatDto: CreateSeatDto): Promise<void> {
    const { floorId } = createSeatDto;

    const floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);

    let seat = new Seat();
    seat = { ...seat, ...createSeatDto, floor };

    try {
      await this.seatRepository.save(seat);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_SAVE_SEAT);
    }

    return;
  }

  async updateOne(seatId: number, updateSeatDto: UpdateSeatDto): Promise<void> {
    let seat = await this.seatRepository.findOne(seatId);

    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_SEAT);

    seat = { ...seat, ...updateSeatDto };

    try {
      await this.seatRepository.save(seat);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_UPDATE_SEAT);
    }

    return;
  }

  async deleteOne(seatId: number): Promise<void> {
    const seat = await this.seatRepository.findOne(seatId);

    if (seat === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_SEAT);

    try {
      await this.seatRepository.deleteOneById(seatId);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_DELETE_SEAT);
    }

    return;
  }
}
