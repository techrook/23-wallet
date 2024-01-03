import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { WalletService } from '../wallet/wallet.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';
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

      it('should create a new user and return a verification token', async () => {
        const createUserDto: CreateUserDto = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password',
            passwordConfirm: 'differentpassword',
            phone: '123456789',
        };
        const verificationToken = await authService.signup(createUserDto);

        expect(typeof verificationToken).toBe('object');
      });

      it('should login user and return a verification token', async () => {
        const logInUser: LoginUserDto = {
            email: 'test@example.com',
            password: 'password'
        };
        const verificationToken = await authService.login(logInUser);

        expect(typeof verificationToken).toBe('object');
      });

      it('should return an access token with the correct payload', async () => {
        const userId = 1;
        const userEmail = 'test@example.com';
  
        const token = await authService.signToken(userId, userEmail);
  
        expect(typeof token).toBe('object');
        
      });
})