import { EntityRepository, Repository } from 'typeorm';

import { SearchFacilityDto } from './dtos/search-facility.dto';
import { Facility } from './facility.entity';

@EntityRepository(Facility)
export class FacilityRepository extends Repository<Facility> {
  async search(search: SearchFacilityDto): Promise<Facility[]> {
    const { floorId } = search;

    const facilities = await this.createQueryBuilder('facility')
      .where(floorId ? 'facility.floor_id = (:floorId)' : '1=1', { floorId })
      .getMany();

    return facilities;
  }

  async deleteOneById(facilityId: number): Promise<void> {
    await this.createQueryBuilder('facility')
      .delete()
      .where('facility.id = (:facilityId)', { facilityId })
      .execute();
  }
}
