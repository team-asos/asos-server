import { EntityRepository, Repository } from 'typeorm';

import { Facility } from './facility.entity';

@EntityRepository(Facility)
export class FacilityRepository extends Repository<Facility> {
  async deleteOneById(facilityId: number): Promise<void> {
    await this.createQueryBuilder('facility')
      .delete()
      .where('facility.id = (:facilityId)', { facilityId })
      .execute();
  }
}
