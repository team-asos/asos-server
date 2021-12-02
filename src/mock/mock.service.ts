import * as faker from 'faker/locale/ko';
import { CreateFloorDto } from 'src/api/floor/dtos/create-floor.dto';
import { FloorService } from 'src/api/floor/floor.service';
import { CreateSeatDto } from 'src/api/seat/dtos/create-seat.dto';
import { SeatService } from 'src/api/seat/seat.service';
import { CreateUserDto } from 'src/api/user/dtos/create-user.dto';
import { UserService } from 'src/api/user/user.service';
import { getConnection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class MockService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly floorService: FloorService,
    private readonly seatService: SeatService,
  ) {}

  async dummy(): Promise<void> {
    /**
     * 상수
     */
    const TABLES = [
      'user',
      'reservation',
      'floor',
      'seat',
      'room',
      'facility',
      'question',
      'answer',
    ];

    // USER SETTING
    const USER_COUNT = this.configService.getNumber('USER_COUNT') || 100;

    // FLOOR SETTING
    const FLOOR_COUNT = this.configService.getNumber('FLOOR_COUNT') || 7;
    const FLOOR_WIDTH = this.configService.getNumber('FLOOR_WIDTH') || 24;
    const FLOOR_HEIGHT = this.configService.getNumber('FLOOR_HEIGHT') || 24;

    // SEAT SETTING
    const SEAT_COUNT = this.configService.getNumber('SEAT_COUNT') || 30;
    const SEAT_TAG_START =
      this.configService.getNumber('SEAT_TAG_START') || 10000;

    // ROOM SETTING
    const ROOM_TAG_START =
      this.configService.getNumber('ROOM_TAG_START') || 20000;

    /**
     * 데이터베이스 초기화
     */
    const connection = await getConnection();

    await connection.query('SET foreign_key_checks = 0;');
    for (const TABLE of TABLES) {
      await connection.query(`TRUNCATE ${TABLE};`);
    }
    await connection.query('SET foreign_key_checks = 1;');

    /**
     * 더미데이터 초기화
     */
    let users: CreateUserDto[] = [];
    let floors: CreateFloorDto[] = [];
    let seats: CreateSeatDto[] = [];

    /**
     * 더미데이터 생성
     */
    users = Array.from({ length: USER_COUNT }, () => {
      return {
        email: faker.internet.email(),
        name: faker.name.lastName() + faker.name.firstName(),
        password: '123',
        tel: faker.phone.phoneNumber('010-####-####'),
        role: 0,
        employeeId: faker.finance.routingNumber(),
        department: faker.name.jobArea(),
        position: faker.name.jobTitle(),
      };
    });

    floors = Array.from({ length: FLOOR_COUNT }, (_, i) => {
      return {
        name: `${i + 1}층`,
        width: FLOOR_WIDTH,
        height: FLOOR_HEIGHT,
      };
    });

    seats = Array.from({ length: SEAT_COUNT }, (_, i) => {
      const floorId = faker.datatype.number(FLOOR_COUNT - 1);

      return {
        name: `${String.fromCharCode(65 + ((floorId - 1) % 26))}${i + 1}`,
        x: faker.datatype.number(FLOOR_WIDTH),
        y: faker.datatype.number(FLOOR_HEIGHT),
        width: 1,
        height: 1,
        tagId: SEAT_TAG_START + i,
        floorId,
      };
    });

    try {
      await Promise.all(
        users.map(async user => await this.userService.createOne(user)),
      );

      for (const floor of floors) {
        await this.floorService.createOne(floor);
      }

      await Promise.all(
        seats.map(async seat => await this.seatService.createOne(seat)),
      );
    } catch (error) {
      console.log(`error: ${error}`);
    }

    return;
  }
}
