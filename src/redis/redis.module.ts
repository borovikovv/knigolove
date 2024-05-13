import { Module } from '@nestjs/common';
import * as Redis from 'redis';
import { REDIS } from './redis.constants';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    ConfigService,
    {
      provide: REDIS,
      useValue: (config: ConfigService) =>
        Redis.createClient({ url: config.get('REDIS_URL') }),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
