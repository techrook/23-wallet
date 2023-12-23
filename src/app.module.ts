import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
@Module({
  imports: [
  PrismaModule,
  ConfigModule.forRoot({ isGlobal: true,envFilePath: '.env', }),
  AuthModule,
  UserModule,
  WalletModule,],
})
export class AppModule {}