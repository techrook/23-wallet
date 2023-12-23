import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { PrismaService } from '../prisma/prisma.service'; 
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WalletService } from 'src/wallet/wallet.service';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private jwt: JwtService,
        private walletService:WalletService,
        private config: ConfigService,){

    }

    async signup (dto:CreateUserDto){
        try {
            const hash = await argon.hash(dto.password);
            if (dto.password != dto.passwordConfirm){
                return new HttpException(
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
            const user_id = user.id.toString();
            delete user.password;
            console.log(user_id)
           const wallet =  await this.walletService.createWallet(user_id)
           console.log(wallet)
            return user
        } catch (error) {
            throw new HttpException(
                'Error creating user', 
                HttpStatus.INTERNAL_SERVER_ERROR, 
              );
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
            throw new HttpException(
                'Error login user', 
                HttpStatus.INTERNAL_SERVER_ERROR, 
              );
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
