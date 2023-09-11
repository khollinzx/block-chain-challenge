// import { SeederModule } from './database/seeders/seeder.module';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Seeder } from './database/seeders/seeder';

async function bootstrap() {
  // NestFactory.createApplicationContext(SeederModule)
  //   .then((appContext) => {
  //     const logger: Logger = new Logger('Seeder');
  //     const seeder: Seeder = appContext.get(Seeder);
  //
  //     seeder
  //       .seed()
  //       .then(() => {
  //         logger.debug('Seeding complete!');
  //       })
  //       .catch((error) => {
  //         logger.error('Seeding failed!');
  //         throw error;
  //       })
  //       .finally(() => appContext.close());
  //   }).catch((error) => { throw error; });
}

bootstrap().then(() => console.log('Completed.'));
