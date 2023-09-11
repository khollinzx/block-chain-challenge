import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProviderModule } from "./common/providers/provider.module";
import { ConfigModule } from "@nestjs/config";
import { BullModule } from "@nestjs/bull";
import { RedisCacheConfigModule } from "./config/cache/redis/config.module";
import { RedisCacheConfigService } from "./config/cache/redis/config.service";
import { AppConfigModule } from "./config/app/config.modeule";
import { CommonModule } from "./common/common.module";
import { ModelsModule } from './models/models.module';
import { AuthModule } from "./common/auth/auth.module";
import {UserService} from "./models/user/user.service";
import {UserRepo} from "./models/user/repositories/user.repo";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.testing'],
    }),
    BullModule.forRootAsync({
      imports: [RedisCacheConfigModule],
      // @ts-ignore
      useFactory: async (configService: RedisCacheConfigService) => ({
        redis: {
          host: configService.host,
          port: +configService.port,
        },
      }),
      inject: [RedisCacheConfigService],
    }),
    AppConfigModule,
    ProviderModule,
    CommonModule,
    ModelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService],
})

export class AppModule {}
