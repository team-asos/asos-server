import HttpError from 'src/common/exceptions/http.exception';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
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
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);

    return floor;
  }

  async createOne(createFloorDto: CreateFloorDto): Promise<void> {
    try {
      let floor = new Floor();

      floor = { ...floor, ...createFloorDto };

      await this.floorRepository.save(floor);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.FAIL_CREATE_FLOOR,
      );
    }
  }

  async updateOne(
    floorId: number,
    updatefloorDto: UpdateFloorDto,
  ): Promise<void> {
    let floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);

    floor = { ...floor, ...updatefloorDto };

    await this.floorRepository.save(floor);
  }

  async deleteOne(floorId: number): Promise<void> {
    const floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);

    try {
      await this.floorRepository.deleteOneById(floorId);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.FAIL_DELETE_FLOOR,
      );
    }
  }
}
