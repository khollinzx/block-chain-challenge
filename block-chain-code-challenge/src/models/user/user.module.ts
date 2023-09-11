import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepo } from "./repositories/user.repo";
import { UtilsModule } from "../../common/utils/utils.module";
import { UserGateway } from './user.gateway';

@Module({
  imports: [
    UtilsModule,
    MongooseModule.forFeatureAsync([{
        name: `${ User.name }`,
        useFactory: () => UserSchema,
      }]
    ),
  ],
  providers: [UserService, UserRepo, UserGateway],
  controllers: [UserController],
  exports: [UserService, UserRepo]
})

export class UserModule {}
