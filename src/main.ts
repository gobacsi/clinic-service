import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { configService } from './configs/config.service';
import { Logger } from './modules/common';

async function startApiServer(port: number) {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.use(bodyParser.json({ limit: configService.BODY_SIZE_LIMIT }));

  await app.startAllMicroservices();
  await app.listen(port).then(() => {
    app.resolve(Logger).then((logger) => {
      logger.log(`Service is listening port ${port}`);
    });
  });
}

async function bootstrap() {
  const port = configService.PORT || 3000;
  await startApiServer(port);
}

bootstrap();
