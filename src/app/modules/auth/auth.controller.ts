import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  async signUp(@Body() registerDTO: RegisterDTO) {
    return this.authService.signUp(registerDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(
    @Request() req,
    @Res({ passthrough: true }) res,
  ): Promise<{
    message: string;
    user: {
      id: string;
      fullName: string;
      email: string;
      accessToken: string;
    };
  }> {
    return this.authService.generateJwtToken(req.user, res);
  }
}
