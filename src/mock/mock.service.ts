import * as faker from 'faker/locale/ko';
import { AnswerService } from 'src/api/answer/answer.service';
import { CreateAnswerDto } from 'src/api/answer/dtos/create-answer.dto';
import { CreateFloorDto } from 'src/api/floor/dtos/create-floor.dto';
import { FloorService } from 'src/api/floor/floor.service';
import { CreateQuestionDto } from 'src/api/question/dtos/create-question.dto';
import { QuestionService } from 'src/api/question/question.service';
import { CreateRoomDto } from 'src/api/room/dtos/create-room.dto';
import { RoomService } from 'src/api/room/room.service';
import { CreateSeatDto } from 'src/api/seat/dtos/create-seat.dto';
import { SeatService } from 'src/api/seat/seat.service';
import { CreateUserDto } from 'src/api/user/dtos/create-user.dto';
import { UserService } from 'src/api/user/user.service';
import { ConfigService } from 'src/config/config.service';
import {
  ANSWERS,
  DEPARTMENTS,
  POSITIONS,
  QUESTIONS,
  TABLES,
} from 'src/constants/index';
import { getConnection } from 'typeorm';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MockService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
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

  getQuestion(): string {
    return QUESTIONS[this.getBetween(0, QUESTIONS.length - 1)];
  }

  getAnswer(): string {
    return ANSWERS[this.getBetween(0, ANSWERS.length - 1)];
  }
  getDepartment(): string {
    return DEPARTMENTS[this.getBetween(0, DEPARTMENTS.length - 1)];
  }

  getPosition(): string {
    return POSITIONS[this.getBetween(0, POSITIONS.length - 1)];
  }

  async dummy(): Promise<void> {
    /**
     * 상수
     */
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
    const SEAT_COL_GROUP = this.configService.getNumber('SEAT_COL_GROUP') || 4;
    const SEAT_ROW_GROUP = this.configService.getNumber('SEAT_ROW_GROUP') || 4;
    const SEAT_PADDING = this.configService.getNumber('SEAT_PADDING') || 1;
    const SEAT_TAG_START = 10000;

    // ROOM SETTING
    const ROOM_COUNT = this.configService.getNumber('ROOM_COUNT') || 10;
    const ROOM_WIDTH = this.configService.getNumber('ROOM_WIDTH') || 3;
    const ROOM_HEIGHT = this.configService.getNumber('ROOM_HEIGHT') || 4;
    const ROOM_PADDING = this.configService.getNumber('ROOM_PADDING') || 1;
    const ROOM_TAG_START = 20000;

    // QUESTION SETTING
    const QUESTION_COUNT = this.configService.getNumber('QUESTION_COUNT') || 10;

    // ANSWER SETTING
    const ANSWER_COUNT = this.configService.getNumber('ANSWER_COUNT') || 10;

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
    let questions: CreateQuestionDto[] = [];
    let answers: CreateAnswerDto[] = [];
    let floors: CreateFloorDto[] = [];
    let seats: CreateSeatDto[] = [];
    let rooms: CreateRoomDto[] = [];

    /**
     * 더미데이터 생성
     */
    users = Array.from({ length: USER_COUNT }, (_, i) => {
      return {
        email: faker.internet.email(),
        name: faker.name.lastName() + faker.name.firstName(),
        password: '123',
        tel: faker.phone.phoneNumber('010-####-####'),
        role: i === 0 ? 1 : 0,
        employeeId: faker.finance.routingNumber(),
        department: this.getDepartment(),
        position: this.getPosition(),
      };
    });

    questions = Array.from({ length: QUESTION_COUNT }, () => {
      return {
        title: this.getQuestion(),
        message: this.getQuestion(),
        userId: this.getBetween(1, USER_COUNT),
      };
    });

    answers = Array.from({ length: ANSWER_COUNT }, (_, i) => {
      return {
        message: this.getAnswer(),
        userId: 1,
        questionId: i + 1,
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

      await Promise.all(
        questions.map(
          async question => await this.questionService.createOne(question),
        ),
      );

      await Promise.all(
        answers.map(async answer => await this.answerService.createOne(answer)),
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
            this.getQuotient(i % SEAT_LINE_MAX, SEAT_COL_GROUP) +
            SEAT_PADDING,
          y:
            this.getQuotient(i, SEAT_LINE_MAX) +
            this.getQuotient(
              this.getQuotient(i, SEAT_LINE_MAX),
              SEAT_ROW_GROUP,
            ) +
            1,
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

    console.log('더미데이터 생성 종료!');

    return;
  }
}
