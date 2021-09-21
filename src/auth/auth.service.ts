import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/user/user.dto';
import { UserRepository } from 'src/user/user.repository';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<boolean | undefined> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.getUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      return isMatch;
    } else return undefined;
  }
}
