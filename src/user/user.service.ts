import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  createUser(createUserDto: CreateUserDto): string {
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;

    this.usersRepository.save(user);

    return '';
  }
}
