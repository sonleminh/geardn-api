import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<IAuthConfig['JWT_SECRET_KEY']>(
        AuthConfigKey.JWT_SECRET_KEY,
      ),
    });
  }

  async validate(payload: any) {
    return payload;
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'sessionToken' in req.cookies &&
      req.cookies.sessionToken.length > 0
    ) {
      return req.cookies.sessionToken;
    }
    return null;
  }
}
