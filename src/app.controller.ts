import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @HttpCode(200)
  async healthChecker(): Promise<void> {
    return;
  }

  @Get('favicon.ico')
  @HttpCode(204)
  async favicon(): Promise<void> {
    return;
  }
}
