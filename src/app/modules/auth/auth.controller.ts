import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards
} from '@nestjs/common';
import { Request as MGRQ } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('ck')
  async checkCookie(@Request() request: MGRQ) {
    // Truy cập signed cookies
    // console.log('Headers:', request.headers);

    // Log cookie trực tiếp từ headers nếu chưa được parse
    // console.log('Raw Cookies from headers:', request.headers.cookie);

    // Nếu cookie-parser được sử dụng, log cookies đã parse
    // console.log('Parsed Cookies:', request.cookies);

    // // Nếu có signed cookies, log signed cookies
    // console.log('Signed Cookies:', request.signedCookies);

    return { cc: 22 };
    // if (Object.keys(cookies).length) {
    //   console.log('Signed Cookies:', cookies);
    //   return { message: 'Signed cookie found', cookies };
    // } else {
    //   return { message: 'No signed cookies found' };
    // }
  }

  @Post('signup')
  async signUp(@Body() registerDTO: RegisterDTO) {
    return this.authService.signUp(registerDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res) {
    // : Promise<{
    //   message: st ring;
    //   user: {
    //     id: string;
    //     fullName: string;
    //     email: string;
    //     accessToken: string;
    //     refreshToken: string;
    //   };
    // }>
    // console.log(req.user)
    // return this.authService.generateJwtToken(req.user, res);
    return this.authService.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  async getProfile(@Request() req) {
    return req.user;
  }

  @Get('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req)
  }
}
