import * as faker from 'faker/locale/ko';
import { CreateFloorDto } from 'src/api/floor/dtos/create-floor.dto';
import { FloorService } from 'src/api/floor/floor.service';
import { CreateRoomDto } from 'src/api/room/dtos/create-room.dto';
import { RoomService } from 'src/api/room/room.service';
import { CreateSeatDto } from 'src/api/seat/dtos/create-seat.dto';
import { SeatService } from 'src/api/seat/seat.service';
import { CreateUserDto } from 'src/api/user/dtos/create-user.dto';
import { UserService } from 'src/api/user/user.service';
import { ConfigService } from 'src/config/config.service';
import { getConnection } from 'typeorm';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly floorService: FloorService,
    private readonly seatService: SeatService,
    private readonly roomService: RoomService,
  ) {}

  getQuotient(dividend: number, divisor: number): number {
    return parseInt(String(dividend / divisor));
  }

  getBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getDepartment(): string {
    const DEPARTMENTS = [
      '사장실',
      '비서실',
      '기획실',
      '인사부',
      '인력개발부',
      '재무부',
      '총무부',
      '경리부',
      '국내영업부',
      '해외영업부',
      '해외사업부',
      '영업관리부',
      '자재부',
      '구매부',
      '생산관리부',
      '내부품질관리부',
      '외부품질관리부',
      '고객지원부',
      '연구개발부',
      '홍보부',
      '물류부',
    ];

    return DEPARTMENTS[this.getBetween(0, DEPARTMENTS.length - 1)];
  }

  getPosition(): string {
    const POSITIONS = [
      '회장',
      '사장',
      '부사장',
      '전무이사',
      '상무이사',
      '이사',
      '부장',
      '차장',
      '과장',
      '대리',
      '계장',
      '주임',
      '사원',
      '인턴',
    ];

    return POSITIONS[this.getBetween(0, POSITIONS.length - 1)];
  }

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
    const FLOOR_WIDTH = this.configService.getNumber('FLOOR_WIDTH') || 16;
    const FLOOR_HEIGHT = this.configService.getNumber('FLOOR_HEIGHT') || 16;

    // SEAT SETTING
    const SEAT_COUNT = this.configService.getNumber('SEAT_COUNT') || 200;
    const SEAT_WIDTH = 1;
    const SEAT_HEIGHT = 1;
    const SEAT_LINE_MAX = this.configService.getNumber('SEAT_LINE_MAX') || 8;
    const SEAT_GAP_EACH = this.configService.getNumber('SEAT_GAP_EACH') || 4;
    const SEAT_PADDING = this.configService.getNumber('SEAT_PADDING') || 1;
    const SEAT_TAG_START = 10000;

    // ROOM SETTING
    const ROOM_COUNT = this.configService.getNumber('ROOM_COUNT') || 10;
    const ROOM_WIDTH = this.configService.getNumber('ROOM_WIDTH') || 3;
    const ROOM_HEIGHT = this.configService.getNumber('ROOM_HEIGHT') || 4;
    const ROOM_PADDING = this.configService.getNumber('ROOM_PADDING') || 1;
    const ROOM_TAG_START = 20000;

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
    let rooms: CreateRoomDto[] = [];

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
        department: this.getDepartment(),
        position: this.getPosition(),
      };
    });

    floors = Array.from({ length: FLOOR_COUNT }, (_, i) => {
      return {
        name: `${i + 1}층`,
        width: FLOOR_WIDTH,
        height: FLOOR_HEIGHT,
      };
    });

    try {
      await Promise.all(
        users.map(async user => await this.userService.createOne(user)),
      );

      for (const floor of floors) {
        await this.floorService.createOne(floor);
      }
    } catch (error) {
      console.log(`error: ${error}`);
    }

    let floorId = 1;

    for (const floor of floors) {
      seats = Array.from({ length: SEAT_COUNT }, (_, i) => {
        return {
          name: `${String.fromCharCode(65 + ((floorId - 1) % 26))}${i + 1}`,
          x:
            (i % SEAT_LINE_MAX) +
            this.getQuotient(i % SEAT_LINE_MAX, SEAT_GAP_EACH) +
            SEAT_PADDING,
          y: this.getQuotient(i, SEAT_LINE_MAX) + 1,
          width: SEAT_WIDTH,
          height: SEAT_HEIGHT,
          tagId: SEAT_TAG_START + i + (floorId - 1) * SEAT_COUNT,
          floorId,
        };
      });

      rooms = Array.from({ length: ROOM_COUNT }, (_, i) => {
        return {
          name: `회의실${i + 1}`,
          maxUser: 4,
          x: ROOM_WIDTH * i + ROOM_PADDING,
          y: FLOOR_HEIGHT - ROOM_HEIGHT - 2,
          width: ROOM_WIDTH,
          height: ROOM_HEIGHT,
          tagId: ROOM_TAG_START + i + (floorId - 1) * ROOM_COUNT,
          floorId,
        };
      });

      try {
        for (const seat of seats) await this.seatService.createOne(seat);
        for (const room of rooms) await this.roomService.createOne(room);
      } catch (error) {
        console.log(`error: ${error}`);
      }

      floorId++;
    }

    return;
  }
}
