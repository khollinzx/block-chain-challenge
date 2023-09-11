import { Global, Module } from "@nestjs/common";
import { UtilsModule } from "./utils/utils.module";
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [ UtilsModule, AuthModule ],
  exports: [ UtilsModule, AuthModule ],
  providers: [],
})

export class CommonModule {}
