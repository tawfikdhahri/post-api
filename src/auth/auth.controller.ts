import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AllowAny } from 'src/customDecorators/allowAny';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dtos/requests/login-request.dto';
import { RegisterRequestDto } from './dtos/requests/register-request.dto';
import { LoginResponseDto } from './dtos/response/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @AllowAny()
  register(@Body() user: RegisterRequestDto): Promise<any | null> {
    return this.authService.register(user);
  }

  @Post('login')
  @AllowAny()
  login(@Body() user: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      return this.authService.login(user);
    } catch (error) {}
  }
}
