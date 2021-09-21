import HttpError from 'src/common/utils/errors/HttpError';
import { LoginUserDto } from 'src/user/user.dto';

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({ status: 200, description: 'Authorized' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const isMatch = await this.authService.validateUser(loginUserDto);

    if (isMatch === true) return 'ok';
    else if (isMatch === false)
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        '비밀번호가 잘못되었습니다.',
      );
    else if (isMatch === undefined)
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        '존재하지 않는 사용자입니다.',
      );
  }
}
