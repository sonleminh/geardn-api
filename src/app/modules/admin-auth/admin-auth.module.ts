import { Module, forwardRef } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthController } from './admin-auth.controller';
import { UserModule } from 'src/app/modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';
import { LocalStrategy } from './strategies/admin-local.strategy';
import { JwtStrategy } from './strategies/admin-jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<IAuthConfig['JWT_SECRET_KEY']>(
          AuthConfigKey.JWT_SECRET_KEY,
        ),
        signOptions: { expiresIn: '86400s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AdminAuthService, LocalStrategy, JwtStrategy],
  controllers: [AdminAuthController],
  exports: [AdminAuthService, LocalStrategy, JwtStrategy],
})
export class AdminAuthModule {}
