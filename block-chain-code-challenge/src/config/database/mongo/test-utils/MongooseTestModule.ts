import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer;

/**
 *
 * @param options
 */
export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongoMemoryServer = await MongoMemoryServer.create();
      return {
        uri: mongoMemoryServer.getUri(),
        ...options,
      };
    },
  });

export const closeInMongoConnection = async () => {
  if (mongoMemoryServer) await mongoMemoryServer.stop();
};
