import { LoginUserDto } from 'src/user/dtos/login-user.dto';

import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Wrong Password' })
  @ApiResponse({ status: 404, description: 'Wrong Email' })
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }
}
