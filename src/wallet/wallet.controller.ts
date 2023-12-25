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
  import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from './wallet.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}
  @HttpCode(HttpStatus.OK)
  @Get("/:walletaddress")
  getWallet(@Param('walletaddress') walletaddress: string,){
    return this.walletService.getWallet(walletaddress)
  }
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  createWallet(@GetUser('id') userId: number){
    return this.walletService.createWallet(userId)
  }
  @Patch('/:walletaddress')
  fundWallet(@Param('walletaddress') walletaddress: string, @Body('amount') amount: number,){
    return this.walletService.fundWallet(walletaddress,amount)
  }

}
