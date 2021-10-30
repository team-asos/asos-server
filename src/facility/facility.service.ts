import HttpError from 'src/common/exceptions/http.exception';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import { FloorRepository } from 'src/floor/floor.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateFacilityDto } from './facility.dto';
import { Facility } from './facility.entity';
import { FacilityRepository } from './facility.repository';

@Injectable()
export class FacilityService {
  constructor(
    private facilityRepository: FacilityRepository,
    private floorRepository: FloorRepository,
  ) {}

  //모든 시설 조회
  async findAll(): Promise<Facility[]> {
    const facilities = await this.facilityRepository.find();

    return facilities;
  }

  //시설 생성
  async createOne(createFacilityDto: CreateFacilityDto): Promise<void> {
    try {
      const { floorId } = createFacilityDto;
      const floor = await this.floorRepository.findOne(floorId);
      if (floor == undefined) {
        throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);
      }
      let facility = new Facility();
      facility = { ...facility, ...createFacilityDto, floor };

      await this.facilityRepository.save(facility);
    } catch (err) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        ErrorMessage.FAIL_SAVE_FACILITY,
      );
    }
    return;
  }

  //시설 삭제
  async deleteOne(facilityId: number): Promise<void> {
    const facility = await this.facilityRepository.findOne();

    if (facility === undefined)
      throw new HttpError(
        HttpStatus.NOT_FOUND,
        ErrorMessage.NOT_FOUND_FACILITY,
      );

    await this.facilityRepository.deleteOneById(facilityId);
  }
}
