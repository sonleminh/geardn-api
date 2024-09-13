import {
  Injectable,
  InternalServerErrorException,
  Request
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request as expressRequest, Response } from 'express';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';
import { ITokenPayload } from 'src/app/interfaces/ITokenPayload';
import { ILoginResponse } from 'src/app/interfaces/IUser';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RegisterDTO } from './dto/register.dto';
@Injectable()
export class AuthService {
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
    const userData = await this.userService.findAndVerify({
      email,
      password,
    });
    return userData;
  }

  async signUp(registerDTO: RegisterDTO) {
    try {
      return this.userService.createUser(registerDTO);
    } catch (error) {
      throw error;
    }
  }

  async login(user: ILoginResponse, res: Response) {
    try {
      const { accessToken, refreshToken } = await this.generaTokens({
        _id: user._id,
        email: user.email,
      });

      this.storeRefreshToken(res, refreshToken);

      const { password, ...tempUser } = user['_doc'];
      // const payload = {
      //   email: user.email,
      //   id_user: String(user._id),
      // };
      // return await this.jwtService.signAsync(payload, {
      //   secret: this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
      //     AuthConfigKey.JWT_SECRET_KEY,
      //   ),
      //   expiresIn: '15m',
      // })
      // console.log(accessToken, refreshToken)
      return { accessToken, user: tempUser };
    } catch (error) {
      throw error;
    }
  }

  async generaTokens(data: ITokenPayload) {
    try {
      const [AT, RT] = await Promise.all([
        this.jwtService.sign(data, { expiresIn: '15m' }),
        this.jwtService.sign(data, { expiresIn: '7d' }),
      ]);
      return {
        accessToken: AT,
        refreshToken: RT,
      };
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async generateJwtToken(
    user: User,
    res: Response,
  ): Promise<{
    message: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      accessToken: string;
      refreshToken: string;
    };
  }> {
    const payload = {
      email: user.email,
      id_user: String(user._id),
    };

    // const [AT, RT] = await Promise.all([
    //   generateToken(data, this.ATSecret, { expiresIn: '7d' }),
    //   generateToken({ _id: data._id }, this.RTSecret, { expiresIn: '7d' }),
    // ]);

    return {
      message: 'Login successful',
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        accessToken: await this.jwtService.signAsync(payload, {
          secret: this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ),
          expiresIn: '15m',
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          secret: this.configService.get<IAuthConfig['RT_SECRET']>(
            AuthConfigKey.RT_SECRET,
          ),
          expiresIn: '7d',
        }),
      },
    };
  }

  storeRefreshToken(res: Response, refreshToken: string) {
    res.cookie('rt', refreshToken, {
      // sameSite: 'none',
      // httpOnly: true,
      // secure: true,
      path: '/',
    });
  }

  async refreshToken(@Request() req: expressRequest) {
    const refreshToken = req.headers.cookie;
    const cleanedToken = decodeURIComponent(refreshToken.replace(/^rt=/, ''));

    if (!refreshToken) {
      return { message: 'Refresh token not found' };
    }

    try {
      const payload = this.jwtService.verify(cleanedToken, {
        secret:
          this.configService.get<IAuthConfig['JWT_SECRET_KEY']>(
            AuthConfigKey.JWT_SECRET_KEY,
          ) || 'JWT_SECRET_KEY',
      });
      const { _id, email, ...rest } = payload;
      const newAccessToken = await this.jwtService.signAsync({ _id, email });
      return { accessToken: newAccessToken };
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
