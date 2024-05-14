import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from './redis.constants';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: 'localhost',
      port: 6379,
    });
  },
  provide: REDIS,
};
