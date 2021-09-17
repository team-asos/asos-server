import { LoggerModule } from 'nestjs-pino';
import { config } from 'src/config/log/config';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';

@Module({
  imports: [LoggerModule.forRoot(config), TypeOrmModule.forRoot(), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
