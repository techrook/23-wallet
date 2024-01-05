import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UpdateUserDto } from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('The UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService, JwtService, ConfigService],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should update a user and return the updated user', async () => {
    const userId = 1;
    const updateuser: UpdateUserDto = {
      firstname: 'test_first_name',
      lastname: 'test_last_name',
    };

    const response = await userService.updateUser(updateuser, userId);

    if (response instanceof HttpException) {
      expect(response.message).toBe(
        'Error occurred while updating user details',
      );
      expect(response.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      expect(typeof response).toBe('object');
      expect(response.id).toBeDefined();
      expect(response.firstname).toBe(updateuser.firstname);
      expect(response.lastname).toBe(updateuser.lastname);
    }
  });
  it('should fetch all users ', async () => {
    
    const response = await userService.get_all_user();
    if (response instanceof HttpException) {
      expect(response.message).toBe('Error fetching users');
      expect(response.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    } else if (typeof response === 'string') {
      // This is the "no user" case
      expect(response).toBe('no user');
    } else {
      expect(response).toBeDefined(); // Assuming you expect a single user
      const user = response[0];
      expect(user.id).toBeDefined();
      expect(user.password).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.username).toBeDefined();
    }
  });
  it('should fetch user by id ', async () => {
    const userId = 1;
    const response = await userService.getUserById(userId);
    if (response instanceof HttpException) {
      expect(response.message).toBe('Error fetching users');
      expect(response.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      expect(response).toBeDefined(); // Assuming you expect a single user
      expect(response.id).toBe(1);
      expect(response.email).toBeDefined();
      expect(response.username).toBeDefined();
    }
  });
  it('delete user by id ', async () => {
    const userId = 1;
    const response = await userService.delete_me(userId);
    if (response instanceof HttpException) {
      expect(response.message).toBe('Error deleting user');
      expect(response.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      expect(response).toBe("account deleted");
    }
  });
  it('change user password ', async () => {
    const userId = 1;
    const newPassword = "asdfghjkl" ;
    const oldpassword ="pasword" ;
    const response = await userService.changePassword(userId,newPassword,oldpassword );
    if (response instanceof HttpException) {
      expect(response.message).toBe('Credentials incorrect');
      expect(response.getStatus()).toBe(HttpStatus.FORBIDDEN);
    } else {
      expect(typeof response).toBe("String");
    }
  });

    it('forgot password', async () => {
    const userId = 1;
    const response = await userService.forgotPassword(userId);
    if (response instanceof HttpException) {
      expect(response.message).toBe('server error');
      expect(response.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      expect(typeof response).toBe("object");
      expect(response.message).toBe("check your mail to complete the reset password step");
    }
  });
});
