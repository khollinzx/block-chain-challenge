import { Global, Module } from "@nestjs/common";
import { MongoDatabaseProviderModule } from './database/mongo/mongo.provider.module';
import { RedisProviderModule } from "./cache/redis/redis.provider.module";

@Global()
@Module({
  imports: [
    MongoDatabaseProviderModule,
    RedisProviderModule,
  ],
  exports: [
    MongoDatabaseProviderModule,
    RedisProviderModule,
  ],
})

export class ProviderModule {}
