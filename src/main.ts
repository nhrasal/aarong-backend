import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { utilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import { AppModule } from './app.module';
import { ENV } from './ENV';

const PORT = ENV.port;
const API_PREFIX = ENV.API_PREFIX;
const APP_TITLE = ENV.API_TITLE;
const API_DESC = ENV.API_DESC;
const API_VERSION = ENV.API_VERSION;

const fileTransport = !ENV.isDevelopment
  ? [
      new transports.File({
        format: format.combine(
          utilities.format.nestLike(),
          format.json(),
          format.timestamp(),
        ),
        filename: ENV.logFilePath,
      }),
    ]
  : [];

const appOptions: NestApplicationOptions = {
  cors: true,
  logger: WinstonModule.createLogger({
    exitOnError: true,

    transports: [
      new transports.Console({
        // silent: true,
        format: format.combine(utilities.format.nestLike()),
      }),
      ...fileTransport,
    ],
  }),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix(API_PREFIX);

  const options = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription(API_DESC)
    .setVersion(API_VERSION)
    .setBasePath(API_PREFIX)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
