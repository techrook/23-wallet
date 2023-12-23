import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) {}

    async createWallet(user_id:string){
        try {
            const wallet = await this.prisma.wallet.create({
                data:{
                    user_id: user_id
                }
            })
            
            if(!wallet) return new HttpException(
                'Error creating wallet',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
            return wallet
        } catch (error) {
            console.log(error)
             return new HttpException(
                'Error creating wallet',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
    async getWallet(user_id:string){
        try {
            const wallet = await this.prisma.wallet.findMany({
            where: {
                user_id:user_id
            }
        })
        if(!wallet) return new HttpException(
            ' wallet not found',
            HttpStatus.NOT_FOUND
        )

        return wallet
        } catch (error) {
             return new HttpException(
                'Error finding  wallet ',
                HttpStatus.NOT_FOUND
            )
        }
        
    };
    async fundWallet(wallet_id: string){};
    async transferFund(){};
    async withdrawFromWallet(){};
}
