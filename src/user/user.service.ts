import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './user.dto';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
@Injectable()
export class UserService {
  private transporter: nodemailer.Transporter;
  constructor(private prisma: PrismaService,private jwt: JwtService,
    private config: ConfigService,) {
      this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.YOUR_APP_MAIL,
          pass: process.env.YOUR_GENERATED_APP_PASSWORD,
        },
      });
  
      //testing success
      this.transporter.verify((err, success) => {
        if (err) {
          console.log(err.message);
        } else {
          console.log('ready for user messages');
          console.log('success');
        }
      });
    }
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
  async forgotPassword(userId:number){
    try {
      const user = await this.prisma.user.findUnique({
        where:{
          id:userId
        }
      })
      if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      const email = user.email;
      const payload = { sub: user.id, email };
      const secret = this.config.get('JWT_SECRET');
      const resetToken = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      });
      const URL = `http://localhost:3333/user/resetpassword/${resetToken}`;
      await this.transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${URL}">Reset Password</a>`,
      });
      return {
        message: `check your mail to complete the reset password step`,
      };
    } catch (error) {
      console.log(error)
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async resetPassword(token: string) {
    try {
      const secret = this.config.get('JWT_SECRET');
      if (!token)
        throw new HttpException('Token Not Fount', HttpStatus.NOT_FOUND);
      const decoded = await this.jwt.verifyAsync(token, { secret: secret });
      console.log(decoded);

      if (!decoded)
        throw new HttpException('Invalid Token', HttpStatus.BAD_REQUEST);

      const redirectUrl = `http://localhost:3333/user/updatepassword/${decoded.sub}`;
      return redirectUrl;
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async updatedResetPassword(userId: string, password: string) {
    try {
      const hash = await argon.hash(password);
      console.log(hash);
      const user = await this.prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          password: hash,
        },
      });
      return {
        message: `your password has successfully been reseted and updated`,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
