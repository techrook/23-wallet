import { PrismaService } from 'src/prisma/prisma.service';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) {}

    async createWallet(user_id:number, ){
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
    async getWallet(walletAddress:string){
        try {
             
             const wallet = await this.prisma.wallet.findUnique({
                where:{
                    uid:walletAddress
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
    async fundWallet(walletAddress:string, amount:number){
        try {
           
            const wallet = await this.prisma.wallet.findUnique({
                where:{
                    uid:walletAddress
                }
            })
            if(!wallet) return new HttpException(
                ' wallet not found',
                HttpStatus.NOT_FOUND
            )
                const wallet_id = wallet.id
                const newBalance = wallet.balance + amount
            const walletNewBalance= await this.prisma.wallet.update({
                where:{
                    id: wallet.id,
                },
                data:{
                    balance: newBalance
                }
            })

            return walletNewBalance
        } catch (error) {
            return new HttpException(
                'Error funding  wallet ',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    };
    async transferFund(){};
    async withdrawFromWallet(){};
}
