import { EntityRepository, Repository } from 'typeorm';

import { SearchRoomDto } from './dtos/search-room.dto';
import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async getMany(): Promise<Room[]> {
    const rooms = await this.createQueryBuilder('room')
      .leftJoinAndSelect('room.floor', 'floor')
      .getMany();

    return rooms;
  }

  async search(search: SearchRoomDto): Promise<Room[]> {
    const { floorId } = search;

    const rooms = await this.createQueryBuilder('room')
      .where(floorId ? 'room.floor_id = (:floorId)' : '1=1', { floorId })
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

  async parseRoom(): Promise<Room[]> {
    const rooms = await this.createQueryBuilder('room')
      .leftJoin('room.floor', 'floor')
      .leftJoin('room.reservations', 'reservations', 'reservations.status = 1')
      .leftJoin('reservations.user', 'user')
      .select([
        'user.name',
        'user.tel',
        'user.department',
        'user.position',
        'room.name',
        'room.tagId',
        'floor.name',
        'reservations.id',
        'reservations.startTime',
        'reservations.endTime',
        'reservations.topic',
      ])
      .where('room.tagId IS NOT NULL')
      .getMany();

    return rooms;
  }
}
