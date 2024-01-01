import { Body, Controller, Post, HttpCode, Get, Param } from '@nestjs/common';
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
  @Get('/verify/:id')
  verifyUser(@Param('id') id: string) {
    return this.authService.verifyUser(id);
  }
}
