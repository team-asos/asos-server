import { EntityRepository, Repository } from 'typeorm';

import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async getMany(): Promise<Room[]> {
    const rooms = await this.createQueryBuilder('room')
      .leftJoinAndSelect('room.floor', 'floor')
      .getMany();

    return rooms;
  }

  async getOneById(roomId: number): Promise<Room> {
    const room = await this.createQueryBuilder('room')
      .leftJoinAndSelect('room.floor', 'floor')
      .where('room.id = (:roomId)', { roomId })
      .getOne();

    return room;
  }

  async deleteOneById(roomId: number): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .where('id = (:roomId)', { roomId })
      .execute();
  }
}
