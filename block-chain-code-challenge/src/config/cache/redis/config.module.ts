import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheConfigService } from './config.service';
import * as Joi from '@hapi/joi';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().default('127.0.0.1'),
        REDIS_PORT: Joi.string().default('6379'),
        REDIS_USERNAME: Joi.string().default(null),
        REDIS_PASSWORD: Joi.string().default(null),
        REDIS_PREFIX: Joi.string().default(''),
        REDIS_TTL: Joi.number().default(60),
      }),
    }),
  ],
  providers: [ConfigService, RedisCacheConfigService],
  exports: [ConfigService, RedisCacheConfigService],
})
export class RedisCacheConfigModule {}
