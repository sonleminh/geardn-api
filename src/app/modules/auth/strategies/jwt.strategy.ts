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
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: configService.get<IAuthConfig['JWT_SECRET_KEY']>(
        AuthConfigKey.JWT_SECRET_KEY,
      ),
    });
  }

  async validate(payload: any) {
    return payload;
  }

  private static extractJWTFromCookie(req: Request): string | null {
    const cookies = req.headers?.cookie;
    // Make sure there are cookies in the request
    if (!cookies) {
      return null;
    }
    // Parse the cookies
    const jwtCookie = cookies
      .split('; ')
      .find((cookie) => cookie.startsWith('at='));

    // If no JWT cookie is found, return null
    if (!jwtCookie) {
      return null;
    }

    // Return only the JWT token value (after 'jwt=')
    return jwtCookie.split('=')[1];
  }
}
