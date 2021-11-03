import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/exceptions/http.exception';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateFloorDto } from './dtos/create-floor.dto';
import { UpdateFloorDto } from './dtos/update-floor.dto';
import { Floor } from './floor.entity';
import { FloorRepository } from 'src/floor/floor.repository';

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

  //층 생성
  async createOne(createFloorDto: CreateFloorDto): Promise<void> {
    const { floorId } = createFloorDto;

    if (floorId === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);

    let floor = new Floor();
    floor = { ...floor, ...createFloorDto };

    await this.floorRepository.save(floor);
  }

  //층 삭제
  async deleteOne(floorId: number): Promise<void> {
    const floor = await this.floorRepository.findOne();

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);
    await this.floorRepository.deleteOneById(floorId);
  }

  //층 수정
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
}
