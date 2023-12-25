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

  @Get("")
  getWallet(@GetUser('id') userId: number){
    return this.walletService.getWallet(userId)
  }
  @Post('')
  createWallet(@GetUser('id') userId: number){
    return this.walletService.createWallet(userId)
  }

}
