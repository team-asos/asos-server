import { EntityRepository, Repository } from 'typeorm';

import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async deleteOneById(roomId: number): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where('id = (:roomId)', { roomId })
      .execute();
  }
}
