import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoConfigService } from './config.service';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().default(
          'mongodb://127.0.0.1:27017/blockchain',
        ),
      }),
    }),
  ],
  providers: [ConfigService, MongoConfigService],
  exports: [ConfigService, MongoConfigService],
})
export class MongoConfigModule {}
