import HttpError from 'src/error/HttpError';

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    const isMatch = await this.userService.loginUser(loginUserDto);

    if (isMatch) return 'ok';
    else throw new HttpError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    await this.userService.createUser(createUserDto);

    return 'ok';
  }
}
