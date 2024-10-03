import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configurations } from './app/config/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConfigKey, IDbConfig } from './app/config/database.config';
import { UserModule } from './app/modules/user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/modules/auth/auth.module';
import { CategoryModule } from './app/modules/category/category.module';
import { ProductModule } from './app/modules/product/product.module';
import { AdminAuthModule } from './app/modules/admin-auth/admin-auth.module';
import { UploadModule } from './app/modules/upload/upload.module';
import { AttributeModule } from './app/modules/attribute/attribute.module';
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
    AuthModule,
    AdminAuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    AttributeModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
