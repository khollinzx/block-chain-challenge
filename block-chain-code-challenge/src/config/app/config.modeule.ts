import * as Joi from '@hapi/joi';
import { Global, Module } from "@nestjs/common";
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';

/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: Joi.object({
        APP_NAME: Joi.string().default('Ambalane API Project'),
        APP_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'local', 'staging')
          .default('local'),
        APP_URL: Joi.string().default('http://localhost:3300'),
        APP_PORT: Joi.number().default(3000),
      }),
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})

export class AppConfigModule {}
