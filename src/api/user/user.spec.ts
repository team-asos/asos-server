import * as faker from 'faker';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';

import { Test, TestingModule } from '@nestjs/testing';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

describe('User Service Test', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('모든 유저 조회', () => {
    it('모든 유저를 조회한다.', async () => {
      const existUsers = [
        {
          id: 1,
          email: faker.internet.email(),
          name: faker.name.findName(),
          password: faker.internet.password(),
          tel: faker.phone.phoneNumber(),
          role: 1,
          employeeId: faker.lorem.word(),
          department: faker.lorem.word(),
          position: faker.lorem.word(),
          createdAt: faker.datatype.datetime(),
          updatedAt: faker.datatype.datetime(),
          deletedAt: null,
          questions: null,
          answers: null,
          reservations: null,
          participants: null,
        },
      ];

      const userRepositoryFindAllSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(existUsers);

      const result = await userService.findAll();

      expect(userRepositoryFindAllSpy).toHaveBeenCalledWith();
      expect(result).toEqual(existUsers);
    });
  });

  describe('특정 유저 조회', () => {
    it('특정 유저를 조회한다.', async () => {
      const userId = faker.datatype.number();

      const existUsers = {
        id: 1,
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
        tel: faker.phone.phoneNumber(),
        role: 1,
        employeeId: faker.lorem.word(),
        department: faker.lorem.word(),
        position: faker.lorem.word(),
        createdAt: faker.datatype.datetime(),
        updatedAt: faker.datatype.datetime(),
        deletedAt: null,
        questions: null,
        answers: null,
        reservations: null,
        participants: null,
      };

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(existUsers);

      const result = await userService.findOne(userId);

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith(userId);
      expect(result).toEqual(existUsers);
    });

    it('존재하지 않는 유저를 조회하는 경우 NotFoundError가 반환된다.', async () => {
      const userId = faker.datatype.number();

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await userService.findOne(userId);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.message).toBe(HttpMessage.NOT_FOUND_USER);
      }

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe('특정 유저 수정', () => {
    it('존재하지 않는 유저 정보를 수정하는 경우 NotFoundError가 반환된다.', async () => {
      const userId = faker.datatype.number();

      const updateUserDto: UpdateUserDto = {
        email: faker.internet.email(),
        name: faker.name.findName(),
      };

      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(undefined);

      try {
        await userService.updateOne(userId, updateUserDto);
      } catch (e: any) {
        expect(e).toBeInstanceOf(HttpError);
        expect(e.message).toBe(HttpMessage.NOT_FOUND_USER);
      }

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith(userId);
    });
  });
});
