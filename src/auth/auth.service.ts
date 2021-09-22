import * as bcrypt from 'bcrypt';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';
import { LoginUserDto } from 'src/user/user.dto';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<boolean | undefined> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.getUserByEmail(email);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);
    else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) return true;
      else
        throw new HttpError(
          HttpStatus.UNAUTHORIZED,
          ErrorMessage.WRONG_PASSWORD,
        );
    }
  }
}
