import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): string {
    this.userService.createUser(createUserDto);

    return '';
  }
}
