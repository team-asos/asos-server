import * as bcrypt from 'bcrypt';
import { ErrorMessage } from 'src/common/utils/errors/ErrorMessage';
import HttpError from 'src/common/utils/errors/HttpError';
import { LoginUserDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  @InjectRepository(UserRepository)
  private readonly userRepository: UserRepository;

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.getOneByEmail(email);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, ErrorMessage.NOT_FOUND_USER);
    else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) return user;
      else
        throw new HttpError(
          HttpStatus.UNAUTHORIZED,
          ErrorMessage.WRONG_PASSWORD,
        );
    }
  }
}
