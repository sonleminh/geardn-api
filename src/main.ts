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

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET, HEAD, PUT, POST, DELETE, OPTIONS, PATCH',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(new ValidationPipe(ValidationConfig));
  app.use(cookieParser(process.env.CK_SECRET));

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
