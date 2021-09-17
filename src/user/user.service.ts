import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

import { CreateUserDto, LoginUserDto } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<boolean> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findOne({
      email,
    });

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch;
  }

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const { email, password } = createUserDto;

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    const user = new User();
    user.email = email;
    user.password = hash;

    await this.usersRepository.save(user);

    return '';
  }
}
