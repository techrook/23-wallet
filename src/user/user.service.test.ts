import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('The UserService', () => {
    let userService :UserService
    let prismaService: PrismaService;
    let jwtService: JwtService;
    let configService: ConfigService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers :[
                UserService,
                PrismaService,
              JwtService,
              ConfigService,
            ]
        }).compile();

        userService = module.get<UserService>(UserService)
        prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    })
    it('should be defined', () => {
        expect(userService).toBeDefined();
      });
      it('should update a user and return the updated user', async () => {
        const userId = 1;
        const updateuser :UpdateUserDto = {
            firstname: "test_first_name",
            lastname: "test_last_name"
        }

        const resonse = await userService.updateUser(updateuser, userId)

        expect(typeof resonse).toBe('object');
      })
})