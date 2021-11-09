import { EntityRepository, Repository } from 'typeorm';

import { Floor } from './floor.entity';

@EntityRepository(Floor)
export class FloorRepository extends Repository<Floor> {
  async getOneById(floorId: number): Promise<Floor> {
    const floor = await this.createQueryBuilder('floor')
      .leftJoinAndSelect('floor.facility', 'facility')
      .leftJoinAndSelect('floor.room', 'room')
      .leftJoinAndSelect('floor.seat', 'seat')
      .leftJoinAndSelect('seat.reservation', 'seat.reservation')
      .leftJoinAndSelect('room.reservation', 'room.reservation')
      .where('floor.id = (:floorId)', { floorId })
      .getOne();
    return floor;
  }
  async deleteOneById(floorId: number): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where('id = (:floorId)', { floorId })
      .execute();
  }
}
