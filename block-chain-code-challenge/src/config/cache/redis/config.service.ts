import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisCacheConfigService {
  /**
   *
   * @param configService
   */
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('redis.host');
  }

  get port(): string {
    return this.configService.get<string>('redis.port');
  }

  get username(): string {
    return this.configService.get<string>('redis.username');
  }

  get password(): string {
    return this.configService.get<string>('redis.password');
  }

  get prefix(): string {
    return this.configService.get<string>('redis.prefix');
  }

  get ttl(): number {
    return this.configService.get<number>('redis.ttl');
  }
}
