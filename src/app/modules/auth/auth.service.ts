import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';
import generateToken from './utils';
import { ITokenPayload } from 'src/app/interfaces/ITokenPayload';
import { Request, Response } from 'express';
import { ILoginResponse } from 'src/app/interfaces/IUser';
@Injectable()
export class AuthService {
  private ATSecret: string;
  private RTSecret: string;
  private CKPath: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    this.RTSecret = this.configService.get('RT_SECRET');
    this.CKPath = this.configService.get('CK_PATH');
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

      console.log(refreshToken)

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
        this.jwtService.sign(data, { expiresIn: '10s' }),
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
      signed: true,
      // httpOnly: true,
      // secure: true,
      path: '/',
    });
  }
}
