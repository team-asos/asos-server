import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

import {
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '본인 정보 조회' })
  @ApiResponse({ status: 200, description: 'Success' })
  async check(@Request() req): Promise<any> {
    return req.user;
  }

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
