import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { FloorRepository } from 'src/floor/floor.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateFacilityDto } from './dtos/create-facility.dto';
import { UpdateFacilityDto } from './dtos/update-facility.dto';
import { Facility } from './facility.entity';
import { FacilityRepository } from './facility.repository';

@Injectable()
export class FacilityService {
  constructor(
    private facilityRepository: FacilityRepository,
    private floorRepository: FloorRepository,
  ) {}

  async findAll(): Promise<Facility[]> {
    const facilities = await this.facilityRepository.find();

    return facilities;
  }

  async createOne(createFacilityDto: CreateFacilityDto): Promise<void> {
    const { floorId } = createFacilityDto;
    const floor = await this.floorRepository.findOne(floorId);

    if (floor == undefined) {
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);
    }

    let facility = new Facility();
    facility = { ...facility, ...createFacilityDto, floor };
    try {
      await this.facilityRepository.save(facility);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_SAVE_FACILITY,
      );
    }
    return;
  }

  async updateOne(
    facilityId: number,
    updatefacilityDto: UpdateFacilityDto,
  ): Promise<void> {
    let facility = await this.facilityRepository.findOne(facilityId);
    if (facility === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FACILITY);

    facility = { ...facility, ...updatefacilityDto };
    try {
      await this.floorRepository.save(facility);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_UPDATE_FACILITY,
      );
    }
  }

  async deleteOne(facilityId: number): Promise<void> {
    const facility = await this.facilityRepository.findOne();

    if (facility === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FACILITY);

    try {
      await this.facilityRepository.deleteOneById(facilityId);
    } catch {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_DELETE_FACILITY,
      );
    }
  }
}
