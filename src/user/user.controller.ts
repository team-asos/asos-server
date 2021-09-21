import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '모든 유저 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getUsers(): Promise<User[]> {
    const users = await this.userService.getUsers();

    return users;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    await this.userService.createUser(createUserDto);

    return 'ok';
  }
}
