import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from './redis.provider';
import { REDIS } from './redis.constants';

@Injectable()
export class RedisService {
  public constructor(
    @Inject(REDIS)
    private readonly client: RedisClient,
  ) {}

  async set(key: string, value: string, expirationSeconds: number) {
    await this.client.set(key, value, 'EX', expirationSeconds);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
