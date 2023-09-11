import { Module } from "@nestjs/common";
import { UtilsService } from "./utils.service";
import { AppConfigModule } from "../../config/app/config.modeule";

@Module({
  imports: [AppConfigModule],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
