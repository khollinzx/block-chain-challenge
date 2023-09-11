import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UtilsModule } from "../utils/utils.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AppConfigService } from "../../config/app/config.service";
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UtilsModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: AppConfigService) => ({
        secret: config.jwtSecret,
        signOptions: {
          expiresIn: config.jwtExpTime,
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [
    PassportModule,
    JwtModule,
    AuthService
  ],
  controllers: [AuthController]
})

export class AuthModule {}
