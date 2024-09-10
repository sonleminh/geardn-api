import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { Request as MGRQ } from 'express';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  @Get('ck')
  checkCookie(@Request() request: MGRQ) {
    // Truy cập signed cookies
    console.log('Headers:', request.headers);

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
}
