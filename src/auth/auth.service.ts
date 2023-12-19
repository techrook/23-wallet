import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,){

    }

    async signup (dto:CreateUserDto){
        try {
            const hash = await argon.hash(dto.password);
            if (dto.password != dto.passwordConfirm){
                throw new HttpException(
                    'user must confim  password',
                    HttpStatus.BAD_REQUEST,
                  );
            }
            const user = await this.prisma.user.create({
                data:{
                    email:dto.email,
                    username:dto.username,
                    password: hash,
                    phone:dto.phone  
                }
            })

            delete user.password;
            return user
        } catch (error) {
            throw new Error(error.message);
        }
    }
    async login (dto:LoginUserDto){
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                  email: dto.email,
                },
              });
              const passwordMatches = await argon.verify(user.password, dto.password);
              if (!passwordMatches) throw new ForbiddenException('Credentials incorrect');
              return this.signToken(user.id, user.email);
        } catch (error) {
            throw new Error(error.message);
        }
    } async signToken(
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
