import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res?: Response,
  ): Promise<{ msg: string }> {
    const response: { msg: string } = await this.authService.validateUser(authDto, res);
    if (!response) throw new UnauthorizedException();
    return response;
  }

  @Post('logout')
  logout(
    @Res() res: Response,
  ): Record<string, any> | 'You are not logged in to log out' {
    if (!res.cookie) {
      return 'You are not logged in to log out';
    }
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    return res.status(200).json({ message: 'Successfully logged out' });
  }
}
