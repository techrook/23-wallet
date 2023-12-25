import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(201)
  @Post('signup')
  signUp(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @HttpCode(202)
  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
