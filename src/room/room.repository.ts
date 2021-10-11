import { EntityRepository, Repository } from 'typeorm';

import { Room } from './room.entity';

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {}
