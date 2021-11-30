import { FloorRepository } from 'src/api/floor/floor.repository';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoomDto } from './dtos/create-room.dto';
import { SearchRoomDto } from './dtos/search-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';
import { Room } from './room.entity';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(
    private roomRepository: RoomRepository,
    private floorRepository: FloorRepository,
  ) {}

  async findAll(): Promise<Room[]> {
    const rooms = await this.roomRepository.getMany();

    return rooms;
  }

  async searchAll(search: SearchRoomDto): Promise<Room[]> {
    const rooms = await this.roomRepository.search(search);

    return rooms;
  }

  async findOne(roomId: number): Promise<Room> {
    const room = await this.roomRepository.getOneById(roomId);

    if (room === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_ROOM);

    return room;
  }

  async createOne(createRoomDto: CreateRoomDto): Promise<Room> {
    const { floorId } = createRoomDto;

    const floor = await this.floorRepository.findOne(floorId);

    if (floor === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_FLOOR);

    let room = new Room();
    room = { ...room, ...createRoomDto, floor };

    try {
      room = await this.roomRepository.save(room);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_SAVE_ROOM);
    }

    return room;
  }

  async updateOne(roomId: number, updateRoomDto: UpdateRoomDto): Promise<void> {
    let room = await this.roomRepository.findOne(roomId);

    if (room === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_ROOM);

    room = { ...room, ...updateRoomDto };

    try {
      await this.roomRepository.save(room);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_UPDATE_ROOM);
    }

    return;
  }

  async deleteOne(roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOne(roomId);

    if (room === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_ROOM);

    try {
      await this.roomRepository.deleteOneById(roomId);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_DELETE_ROOM);
    }

    return room;
  }
}
