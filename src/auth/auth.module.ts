import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { WalletService } from 'src/wallet/wallet.service';
@Module({
  imports: [ JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, WalletService]
})
export class AuthModule {}
