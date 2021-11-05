import * as bcrypt from 'bcrypt';
import HttpError from 'src/common/exceptions/http.exception';
import { HttpMessage } from 'src/common/utils/errors/http-message.enum';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<User> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.getOneByEmail(email);

    if (user === undefined)
      throw new HttpError(HttpStatus.NOT_FOUND, HttpMessage.NOT_FOUND_USER);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      throw new HttpError(HttpStatus.UNAUTHORIZED, HttpMessage.WRONG_PASSWORD);

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
