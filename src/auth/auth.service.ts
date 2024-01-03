import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private walletService: WalletService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.YOUR_APP_MAIL,
        pass: process.env.YOUR_GENERATED_APP_PASSWORD,
      },
    });

    this.transporter.verify((err, success) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log('ready for auth messages');
        console.log(success);
      }
    });
  }

  async signup(dto: CreateUserDto) {
    try {
      const hash = await argon.hash(dto.password);
      if (dto.password != dto.passwordConfirm) {
        return new HttpException(
          'user must confim  password',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          phone: dto.phone,
        },
      });
      if (!user)
        return new HttpException(
          'Error occured during signup',
          HttpStatus.BAD_REQUEST,
        );
        const verificationToken = await this.signToken(user.id, user.email);
      const url = `http://localhost:3333/auth/verify/${user.id}`;
      this.transporter.sendMail({
        to: dto.email,
        subject: 'Verify Account',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`,
      });
      delete user.password;
      const user_id = user.id.toString(); 
      const wallet = await this.walletService.createWallet(user.id);
      return verificationToken;
    } catch (error) {
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async verifyUser(id: string) {
    // Check we have an id
    if (!id) throw new HttpException('Bad request ', HttpStatus.BAD_REQUEST);
    try {
      const userid = parseInt(id);
      // Step 2 - Find user with matching ID
      const user = await this.prisma.user.findUnique({
        where: {
          id: userid,
        },
      });
      if (!user) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      // Step 3 - Update user verification status to true
      await this.prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          verified: true,
        },
      });
      return {
        message: 'Account Verified',
      };
       } catch (err) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async login(dto: LoginUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      if (!user)
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      const passwordMatches = await argon.verify(user.password, dto.password);
      if (!passwordMatches)
        throw new ForbiddenException('Credentials incorrect');
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw new HttpException(
        'Error login user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async signToken(
    id: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const Token = await this.jwt.signAsync(payload, {
      expiresIn: '5d',
      secret: secret,
    });

    return {
      access_token: Token,
    };
  }
}
