import { LoggerService } from 'src/common/utils/logger/logger.service';

import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';

const providers = [ConfigService, LoggerService];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class ConfigModule {}
