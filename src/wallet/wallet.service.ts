import { PrismaService } from 'src/prisma/prisma.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async createWallet(user_id: number) {
    try {
      const wallet = await this.prisma.wallet.create({
        data: {
          user_id: user_id,
        },
      });

      if (!wallet)
        return new HttpException(
          'Error creating wallet',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      return wallet;
    } catch (error) {
      console.log(error);
      return new HttpException(
        'Error creating wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getWallet(walletAddress: string) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          wallet_address: walletAddress,
        },
      });
      if (!wallet)
        return new HttpException(' wallet not found', HttpStatus.NOT_FOUND);

      return wallet;
    } catch (error) {
      return new HttpException('Error finding  wallet ', HttpStatus.NOT_FOUND);
    }
  }
  async fundWallet(walletAddress: string, amount: number) {
    try {
      const wallet = await this.prisma.wallet.findUnique({
        where: {
          wallet_address: walletAddress,
        },
      });
      if (!wallet)
        return new HttpException(' wallet not found', HttpStatus.NOT_FOUND);
      const wallet_id = wallet.id;
      const newBalance = wallet.balance + amount;
      const walletNewBalance = await this.prisma.wallet.update({
        where: {
          id: wallet_id,
        },
        data: {
          balance: newBalance,
        },
      });

      return walletNewBalance;
    } catch (error) {
      return new HttpException(
        'Error funding  wallet ',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async transferFund(
    senderWalletAddress: string,
    recieverWalletAddress: string,
    amount: number,
  ) {
    try {
      const senderWallet = await this.prisma.wallet.findUnique({
        where: {
          wallet_address: senderWalletAddress,
        },
      });
      if (!senderWallet)
        return new HttpException(
          'Sender wallet not found',
          HttpStatus.NOT_FOUND,
        );
      if (senderWallet.balance < amount)
        return new HttpException(
          'Transaction failed , insufficient funds',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      const senderWallet_id = senderWallet.id;
      const senderNewBalance = senderWallet.balance - amount;

      const senderWalletNewBalance = await this.prisma.wallet.update({
        where: {
          id: senderWallet_id,
        },
        data: {
          balance: senderNewBalance,
        },
      });
      if (!senderWalletNewBalance)
        return new HttpException(
          'Error occured during transaction',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      const recieverWallet = await this.prisma.wallet.findUnique({
        where: {
          wallet_address: recieverWalletAddress,
        },
      });
      if (!recieverWallet)
        return new HttpException(
          'reciever wallet not found',
          HttpStatus.NOT_FOUND,
        );

      const recieverWallet_id = recieverWallet.id;
      const recieverNewBalance = recieverWallet.balance + amount;

      const recieverWalletNewBalance = await this.prisma.wallet.update({
        where: {
          id: recieverWallet_id,
        },
        data: {
          balance: recieverNewBalance,
        },
      });
      if (!recieverWalletNewBalance)
        return new HttpException(
          'Error occured during transaction',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      return senderWalletNewBalance;
    } catch (error) {
      return new HttpException(
        'Error occured during transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
