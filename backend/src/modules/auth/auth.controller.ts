import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@/application/auth/dto/login.dto';

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
}
