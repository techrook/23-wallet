import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './user.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,) {}
  async updateUser(dto: UpdateUserDto, userId: number) {
    try {
      
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
      if (!updatedUser) return new HttpException('Error occured while updating user details', HttpStatus.INTERNAL_SERVER_ERROR);
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      return new HttpException('Error occured while updating user details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async get_all_user() {
    try {
      const users = await this.prisma.user.findMany();
    if (users.length === 0) return ' no user';
    return users;
    } catch (error) {
      return new HttpException('Error fetching users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getUserById(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: Number(userId),
        },
      });
      if (!user) return new HttpException('Not found', HttpStatus.NOT_FOUND);
      delete user.password
      return user;
    } catch (error) {
      return new HttpException('Error fetching user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async delete_me(userId: number) {
    try {
      const deleteUser = await this.prisma.user.delete({
        where: {
          id: Number(userId),
        },
      });
      if (!deleteUser)
        return new HttpException('Error occured, account not deleted', HttpStatus.NOT_FOUND);
      return 'account deleted';
    } catch (error) {
      return new HttpException('Error deleting user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async changePassword(userId: number,
    newPassword: string,
    oldpassword: string,){
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                  id: userId,
                },
              });
              if (!user) return new HttpException('Not found', HttpStatus.NOT_FOUND);
              const pwMatches = await argon.verify(user.password, oldpassword);
              if (!pwMatches) return new ForbiddenException('Credentials incorrect');
              const hashNewPassword = await argon.hash(newPassword);
              const updateUser = await this.prisma.user.update({
                where: {
                  email: user.email,
                },
                data: {
                  password: hashNewPassword,
                },
              });
              if(!updateUser) return new HttpException('Password not updated', HttpStatus.INTERNAL_SERVER_ERROR);
              return { message: `${updateUser.email} password has been updated ` };

        } catch (error) {
            return new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }
}
