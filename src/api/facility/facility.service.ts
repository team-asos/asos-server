import { FloorRepository } from 'src/api/floor/floor.repository';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateFacilityDto } from './dtos/create-facility.dto';
import { SearchFacilityDto } from './dtos/search-facility.dto';
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

  async searchAll(search: SearchFacilityDto): Promise<Facility[]> {
    const facilities = await this.facilityRepository.search(search);

    return facilities;
  }

  async createOne(createFacilityDto: CreateFacilityDto): Promise<Facility> {
    const { floorId } = createFacilityDto;
    const floor = await this.floorRepository.findOne(floorId);

    if (floor == undefined) {
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);
    }

    let facility = new Facility();
    facility = { ...facility, ...createFacilityDto, floor };

    try {
      facility = await this.facilityRepository.save(facility);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        HttpMessage.FAIL_SAVE_FACILITY,
      );
    }

    return facility;
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

    return;
  }

  async deleteOne(facilityId: number): Promise<Facility> {
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

    return facility;
  }
}
