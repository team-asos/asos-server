import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/user/user.dto';
import { UserRepository } from 'src/user/user.repository';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UserRepository) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<boolean> {
    const { email, password } = loginUserDto;

    const user = await this.usersRepository.findOne({
      email,
    });

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch;
  }
}
