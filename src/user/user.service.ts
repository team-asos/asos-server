import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

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
