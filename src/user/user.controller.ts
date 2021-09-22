import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
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
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();

    return users;
  }

  @Get(':userId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 유저 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Wrong userId' })
  async findOne(@Param('userId') userId: number): Promise<User> {
    const user = await this.userService.findOne(userId);

    return user;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '유저 생성' })
  @ApiResponse({ status: 201, description: 'Success' })
  async createOne(@Body() createUserDto: CreateUserDto): Promise<string> {
    await this.userService.createOne(createUserDto);

    return 'success';
  }

  @Delete(':userId')
  @HttpCode(200)
  @ApiOperation({ summary: '특정 유저 삭제' })
  @ApiResponse({ status: 200, description: 'Success' })
  async deleteOne(@Param('userId') userId: number): Promise<string> {
    await this.userService.deleteOne(userId);

    return 'success';
  }
}
