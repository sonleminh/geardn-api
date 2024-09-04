import { Injectable } from '@nestjs/common';
import { RegisterDTO } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    // private readonly jwtService: JwtService,
  ) {
    // this.ATSecret = this.configService.get('AT_SECRET');
    // this.RTSecret = this.configService.get('RT_SECRET');
    // this.CKPath = this.configService.get('CK_PATH');
  }
  async signUp(registerDTO: RegisterDTO) {
    try {
      return this.userService.createUser(registerDTO);
    } catch (error) {
      throw error;
    }
  }
}
