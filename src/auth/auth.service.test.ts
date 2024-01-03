import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from '../transaction/transaction.service';
describe('The AuthenticationService', () => {
    let authService: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
              AuthService,
              PrismaService,
              JwtService,
              ConfigService,
              WalletService,
              TransactionService
            ],
          }).compile();

          authService = module.get<AuthService>(AuthService);
    })

    it('should be defined', () => {
        expect(authService).toBeDefined();
      });
})