import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@/application/auth/dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('ping')
  ping() {
    return { message: 'auth alive' };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.loginWithEmail(dto.email, dto.password);
  }

  @Post('oauth/login')
  loginWithOAuth(@Body('token') token: string) {
    return this.authService.loginWithOAuth(token);
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  logoutAll(@Req() req: Request) {
    return this.authService.logoutAll(req.user!.sub);
  }
}
