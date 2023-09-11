import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express";
import { useContainer } from 'class-validator';
import { ValidationPipe } from "@nestjs/common";
import { AppConfigService } from "./config/app/config.service";

let workers: number;

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule,
    {
      rawBody: true,
      bodyParser: true
    }
  );

  // Set app to use graphql-upload
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.setGlobalPrefix('api/'); // set the Global API path
  app.enableCors({
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const appConfigService: AppConfigService = app.get(AppConfigService);
  const port: number = +appConfigService.port || 3000;
  workers = +appConfigService.workers;

  await app.listen(port, appConfigService.url, () =>
    console.log(`App is listening on port: ${ port }`),
  );

  // Gracefully shutdown the server.
  app.enableShutdownHooks();
}

bootstrap().then(d => console.log(d));
