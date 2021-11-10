import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { FloorRepository } from 'src/floor/floor.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateFloorDto } from './dtos/create-floor.dto';
import { UpdateFloorDto } from './dtos/update-floor.dto';
import { Floor } from './floor.entity';

@Injectable()
export class FloorService {
  constructor(private floorRepository: FloorRepository) {}

  async findAll(): Promise<Floor[]> {
    const floors = await this.floorRepository.find();

    return floors;
  }

  async findOne(floorId: number): Promise<Floor> {
    const floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);

    return floor;
  }

  async createOne(createFloorDto: CreateFloorDto): Promise<void> {
    let floor = new Floor();

    floor = { ...floor, ...createFloorDto };

    try {
      await this.floorRepository.save(floor);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_SAVE_FLOOR);
    }

    return;
  }

  async updateOne(
    floorId: number,
    updatefloorDto: UpdateFloorDto,
  ): Promise<void> {
    let floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);

    floor = { ...floor, ...updatefloorDto };

    try {
      await this.floorRepository.save(floor);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_UPDATE_FLOOR,
      );
    }

    return;
  }

  async deleteOne(floorId: number): Promise<void> {
    const floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);

    try {
      await this.floorRepository.deleteOneById(floorId);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_DELETE_FLOOR,
      );
    }

    return;
  }
}
