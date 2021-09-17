import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    await this.userService.createUser(createUserDto);

    return 'ok';
  }
}
