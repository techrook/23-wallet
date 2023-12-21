// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { PrismaService } from '../prisma/prisma.service'; 
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { CreateUserDto, LoginUserDto } from './auth.dto';
// import { HttpException, ForbiddenException, HttpStatus } from '@nestjs/common';
// import * as argon from 'argon2';

// jest.mock('argon2');

// describe('AuthService', () => {
//   let service: AuthService;
//   let prismaServiceMock: jest.Mocked<PrismaService>;
//   let jwtServiceMock: jest.Mocked<JwtService>;
//   let configServiceMock: jest.Mocked<ConfigService>;

//   beforeEach(async () => {
//     prismaServiceMock = {
//       user: {
//         create: jest.fn(),
//         findUnique: jest.fn(),
//       },
//     } as any;

//     jwtServiceMock = {
//       signAsync: jest.fn(),
//     } as any;

//     configServiceMock = {
//       get: jest.fn(),
//     } as any;

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         { provide: PrismaService, useValue: prismaServiceMock },
//         { provide: JwtService, useValue: jwtServiceMock },
//         { provide: ConfigService, useValue: configServiceMock },
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('signup', () => {
//     it('should create a user', async () => {
//       // Arrange
//       const createUserDto: CreateUserDto = {
//         "email":"ito@gmail.com",
//         "password": "qwerty123",
//         "username": "ito",
//         "phone": "234567890",
//         "passwordConfirm": "qwerty123"
//     };;

//       // Act
//       await service.signup(createUserDto);

//       // Assert
//       expect(prismaServiceMock.user.create).toHaveBeenCalledWith({
//         data: expect.objectContaining({
//           email: createUserDto.email,
//           username: createUserDto.username,
//           phone: createUserDto.phone
//         }),
//       });
//     });

//     it('should hash the password and return the user without password', async () => {
//       // Arrange
     
//       const createUserDto:CreateUserDto = {
//     "email":"ito@gmail.com",
//     "password": "qwerty123",
//     "username": "ito",
//     "phone": "234567890",
//     "passwordConfirm": "qwerty123"
// };
// const mockedUser = {
//   "id": 1,
//   "username": "ito",
//   "phone": "234567890",
//   "email": "ito@gmail.com",
// };
// jest.spyOn(argon, 'hash').mockResolvedValueOnce('hashedPassword');
// (prismaServiceMock.user.create as jest.Mock).mockResolvedValueOnce({ ...createUserDto, id: 1 });

//       // Act
//       const result = await service.signup(createUserDto);
//       // Assert
//       expect(argon.hash).toHaveBeenCalledWith(createUserDto.password);
//       expect(result).toEqual(expect.objectContaining(mockedUser));
//       // expect(result.password).toBeUndefined();
//     });

//     it('should throw a HttpException when password confirmation fails', async () => {
//       // Arrange
//       const createUserDto: CreateUserDto = {
//         // ...other properties
//         "email":"ito@gmail.com",
//         "username": "ito",
//         "phone": "234567890",
//         password: 'password',
//         passwordConfirm: 'password123', // invalid confirmation
//       };

//       // Act & Assert
//       await expect(service.signup(createUserDto)).rejects.toThrowError(
//         new HttpException(
//           'user must confim  password',
//           HttpStatus.BAD_REQUEST,
//         ),
//       );
//     });

//   });

//   describe('login', () => {
//     it('should verify user credentials and return a token', async () => {
//       // Arrange
//       const loginUserDto: LoginUserDto = {
//         "email":"ito@gmail.com",
//        "password": "qwerty123"
//    };
//       const mockedUser ={
//         "id": 1,
//         "username": "ito",
//         "phone": "234567890",
//         "email": "ito@gmail.com",
//         "password": "qwerty123"
//       };;

//       (prismaServiceMock.user.findUnique as jest.Mock).mockResolvedValueOnce(mockedUser);

//       (argon.verify as jest.Mock).mockResolvedValueOnce(true);


//       jwtServiceMock.signAsync.mockResolvedValueOnce('mockedToken');

//       // Act
//       const result = await service.login(loginUserDto);

//       // Assert
//       expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
//         where: { email: loginUserDto.email },
//       });
//       expect(argon.verify).toHaveBeenCalledWith(mockedUser.password, loginUserDto.password);
//       expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
//         { sub: mockedUser.id, email: mockedUser.email },
//         { expiresIn: '5d', secret: configServiceMock.get('JWT_SECRET') },
//       );
//       expect(result).toEqual({ access_token: 'mockedToken' });
//     });

//     it('should throw a ForbiddenException when password verification fails', async () => {
//       // Arrange
//       const loginUserDto: LoginUserDto = {
//         "email":"ito@gmail.com",
//        "password": "qwerty123fake"
//    };
//       const mockedUser ={
//         "id": 1,
//         "username": "ito",
//         "phone": "234567890",
//         "email": "ito@gmail.com",
//         "password": "qwerty123"
//       };;

//       (prismaServiceMock.user.findUnique as jest.Mock).mockResolvedValueOnce(mockedUser);

//       (argon.verify as jest.Mock).mockResolvedValueOnce(true);

//       // Act & Assert
//       await expect(service.login(loginUserDto)).rejects.toThrowError(
//         new ForbiddenException('Credentials incorrect'),
//       );
//     });

//     // Add more test cases for error scenarios
//   });

//   // Add more test cases for other methods and error scenarios
// });
