import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppConfigKey, IAppConfig } from './app/config/app.config';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ValidationConfig } from './app/config/validation.config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const apiPrefix = configService.get<IAppConfig['API_PREFIX']>(
    AppConfigKey.APP_PREFIX,
  );

  const whiteList = configService
    .get<IAppConfig['WHITE_LIST']>(AppConfigKey.WHITE_LIST)
    ?.toString()
    .split(',')
    .map((val) => val.trim());

  app.use(helmet());
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whiteList.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  // app.use(cookieParser(process.env.CK_SECRET));

  await app.listen(
    configService.get<IAppConfig['PORT']>(AppConfigKey.PORT),
    async () => {
      console.log(
        `The server is running with ${configService.get<IAppConfig['PORT']>(AppConfigKey.PORT)}`,
      );
    },
  );
}
bootstrap();
