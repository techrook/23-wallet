import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TransactionService } from 'src/transaction/transaction.service';
@Module({
  imports: [],
  providers: [WalletService, TransactionService],
  controllers: [WalletController]
})
export class WalletModule {}
