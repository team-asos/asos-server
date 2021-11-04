import { EntityRepository, Repository } from 'typeorm';

import { Floor } from './floor.entity';

@EntityRepository(Floor)
export class FloorRepository extends Repository<Floor> {
  async deleteOneById(floorId: number): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where('id = (:floorId)', { floorId })
      .execute();
  }
}
