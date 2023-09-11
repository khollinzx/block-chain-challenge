import { Global, Module } from "@nestjs/common";
import { RedisCacheConfigService } from '../../../../config/cache/redis/config.service';
import { RedisCacheConfigModule } from '../../../../config/cache/redis/config.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [RedisCacheConfigModule],
      inject: [RedisCacheConfigService],
      useFactory: async (configService: RedisCacheConfigService) => ({
        store: `${redisStore}`,
        host: configService.host,
        username: configService.username,
        password: configService.password,
        port: configService.port,
        prefix: configService.prefix,
        ttl: parseInt(`${configService.ttl}`),
      }),
      isGlobal: true,
    }),
  ],
  providers: [RedisCacheConfigService],
})
export class RedisProviderModule {}
