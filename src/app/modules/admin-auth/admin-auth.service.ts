import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request as expressRequest, Response } from 'express';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';
import { ITokenPayload } from 'src/app/interfaces/ITokenPayload';
import { ILoginResponse } from 'src/app/interfaces/IUser';
import { RegisterDTO } from './dto/register.dto';
import { UserService } from '../user/user.service';
@Injectable()
export class AdminAuthService {
  private ATSecret: string;
  private RTSecret: string;
  private CKPath: string;
  private JwtSecretKey: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    this.RTSecret = this.configService.get('RT_SECRET');
    this.CKPath = this.configService.get('CK_PATH');
    this.JwtSecretKey = this.configService.get('JWT_SECRET_KEY');
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findAndVerify({
      email,
      password,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: ILoginResponse, res: Response) {
    try {
      const { accessToken, refreshToken } = await this.generaTokens({
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

      this.storeToken(res, 'at', accessToken);
      this.storeToken(res, 'rt', refreshToken);

      const { password, ...tempUser } = user['_doc'];
      return tempUser;
    } catch (error) {
      throw error;
    }
  }

  async logout(req: expressRequest, res: Response) {
    res.clearCookie('at');
    res.clearCookie('rt');
    res.clearCookie('GC');
    return { message: 'Logout successful!', statusCode: HttpStatus.OK };
  }

  async generaTokens(data: ITokenPayload) {
    try {
      const [AT, RT] = await Promise.all([
        this.jwtService.signAsync(data, {
          secret: this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ),
          expiresIn: '1d',
        }),
        this.jwtService.signAsync(data, {
          secret: this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ),
          expiresIn: '7d',
        }),
      ]);
      return {
        accessToken: AT,
        refreshToken: RT,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  storeToken(res: Response, tokenName: string, token: string) {
    res.cookie(tokenName, token, {
      // sameSite: 'none',
      // httpOnly: true,
      // secure: true,
      path: '/',
    });
  }

  async refreshToken(@Request() req: expressRequest, res: Response) {
    const tokens = req.headers.cookie;
    if (!tokens) {
      throw new HttpException(
        'Refresh token is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const refreshToken = tokens
      ?.split('; ')
      .find((tokens) => tokens.startsWith('rt='))
      ?.split('=')[1];
    try {
      const payload = await this.jwtService.verify(refreshToken, {
        secret:
          this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ) || 'JWT_SECRET_KEY',
      });
      const { _id, email, name, role, ...rest } = payload;
      const newAccessToken = await this.jwtService.signAsync(
        { _id, email, name, role },
        {
          secret: this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ),
          expiresIn: '1d',
        },
      );
      return {
        accessToken: newAccessToken,
        statusCode: HttpStatus.OK,
      };
      // return 2;
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
