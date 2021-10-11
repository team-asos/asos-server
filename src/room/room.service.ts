import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';
import { FloorRepository } from 'src/floor/floor.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoomDto } from './room.dto';
import { Room } from './room.entity';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private floorRepository: FloorRepository,
  ) {}

  async findAll(): Promise<Room[]> {
    const rooms = await this.roomRepository.find();

    return rooms;
  }

  async findOne(roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOne(roomId);

    if (room === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_ROOM);

    return room;
  }

  async createOne(createRoomDto: CreateRoomDto): Promise<void> {
    const { floorId } = createRoomDto;

    const floor = await this.floorRepository.findOne(floorId);
    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_FLOOR);

    let room = new Room();
    room = { ...room, ...createRoomDto, floor };

    await this.roomRepository.save(room);

    return;
  }
}
