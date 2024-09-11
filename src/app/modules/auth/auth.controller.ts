import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  Res,
  Response,
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
