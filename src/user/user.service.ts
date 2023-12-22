import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './user.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async updateUser(dto: UpdateUserDto, userId: number) {
    if (!userId) return new HttpException('Not found', HttpStatus.NOT_FOUND);
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return new HttpException('Not found', HttpStatus.NOT_FOUND);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: dto,
    });
    delete updatedUser.password;
    return updatedUser;
  }
  async get_all_user() {
    const users = await this.prisma.user.findMany();
    if (users.length === 0) return ' no user';
    return users;
  }
  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!user) return new HttpException('Not found', HttpStatus.NOT_FOUND);
    delete user.password
    return user;
  }
  async delete_me(userId: number) {
    const deleteUser = await this.prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    if (!deleteUser)
      return new HttpException('Not found', HttpStatus.NOT_FOUND);
    return 'account deleted';
  }
}
