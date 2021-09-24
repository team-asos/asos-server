import * as bcrypt from 'bcrypt';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users;
  }

  async findOne(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<void> {
    const { password } = createUserDto;

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    let user = new User();
    user = { ...user, ...createUserDto, password: hash };

    await this.userRepository.save(user);

    return;
  }

  async deleteOne(userId: number): Promise<void> {
    const user = await this.userRepository.findOne(userId);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);

    await this.userRepository.deleteOneById(userId);
  }
}
