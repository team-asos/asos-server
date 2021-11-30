import * as bcrypt from 'bcrypt';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';

import { HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { SearchUserDto } from './dtos/search-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async searchAll(search: SearchUserDto): Promise<User[]> {
    const users = await this.userRepository.search(search);

    return users;
  }

  async findOne(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<void> {
    const { email, password } = createUserDto;

    const isExist = await this.userRepository.getOneByEmail(email);

    if (isExist)
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.DUPLICATE_ID);

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    let user = new User();
    user = {
      ...user,
      ...createUserDto,
      password: hash,
    };

    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_SAVE_USER);
    }

    return;
  }

  async updateOne(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
    let user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    const { password } = updateUserDto;

    if (password) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);

      user = { ...user, ...updateUserDto, password: hash };
    } else {
      user = { ...user, ...updateUserDto };
    }

    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_UPDATE_USER);
    }

    return;
  }

  async deleteOne(userId: number): Promise<void> {
    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    try {
      await this.userRepository.deleteOneById(userId);
    } catch (err) {
      throw new HttpError(HttpStatus.BAD_REQUEST, HttpMessage.FAIL_DELETE_USER);
    }

    return;
  }
}
