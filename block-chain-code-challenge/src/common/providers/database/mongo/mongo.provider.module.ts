import { Module } from '@nestjs/common';
import { MongoConfigModule } from '../../../../config/database/mongo/config.module';
import { MongoConfigService } from '../../../../config/database/mongo/config.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: async (config: MongoConfigService) => ({
        uri: config.uri,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [MongoConfigService],
    }),
  ],
})
export class MongoDatabaseProviderModule {}
