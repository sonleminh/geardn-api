import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthConfigKey, IAuthConfig } from 'src/app/config/auth.config';

@Injectable()
export class AuthService {
  private ATSecret: string;

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.ATSecret = this.configService.get('AT_SECRET');
    // this.RTSecret = this.configService.get('RT_SECRET');
    // this.CKPath = this.configService.get('CK_PATH');
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
    };
  }> {

    const payload = {
      email: user.email,
      id_user: String(user._id),
    };

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
          // expiresIn: '10s',
        }),
      },
    };
  }
}
