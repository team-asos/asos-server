import { User } from 'src/user/user.entity';

import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Wrong Password' })
  @ApiResponse({ status: 404, description: 'Wrong Email' })
  async login(@Request() req): Promise<User> {
    const user = req.user;

    return user;
  }
}
