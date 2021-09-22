import { LoginUserDto } from 'src/user/user.dto';

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Wrong Password' })
  @ApiResponse({ status: 404, description: 'Wrong Email' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const isValidate = await this.authService.validateUser(loginUserDto);

    if (isValidate) return 'ok';
  }
}
