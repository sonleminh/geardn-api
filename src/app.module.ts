import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from './app/config/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfigKey, IDbConfig } from './app/config/database.config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { AuthModule } from './app/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...configurations],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 10, limit: 200 }],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<IDbConfig['MONGO_HOST']>(
          DbConfigKey.MONGO_HOST,
        );
        const username = configService.get<IDbConfig['MONGO_USER']>(
          DbConfigKey.MONGO_USER,
        );
        const password = configService.get<IDbConfig['MONGO_PASSWORD']>(
          DbConfigKey.MONGO_PASSWORD,
        );
        return {
          uri: `mongodb+srv://${username}:${password}@${host}`,
        };
      },
    }),
    // AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
