import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';
import { WalletService } from 'src/wallet/wallet.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('/update')
  updateUser(@GetUser('id') userId: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(dto, userId);
  }
  @HttpCode(HttpStatus.OK)
  @Get('')
  get_all_user() {
    return this.userService.get_all_user();
  }
  @HttpCode(HttpStatus.OK)
  @Get('/:userId')
  getUserById(@Param('userId') userId: number) {
    return this.userService.getUserById(userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('')
  delete_me(@GetUser('id') userId: number) {
    return this.userService.delete_me(userId);
  }
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('/changepassword')
  changePassword(@GetUser('id') userId: number,  @Body('oldPassword') oldPassword: string,
  @Body('newPassword') newPassword: string,) {
    return this.userService.changePassword(userId, newPassword, oldPassword);
  }
}
