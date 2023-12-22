import { IsEmail, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

class UpdateUserDto {
  @IsString({ message: 'Please provide a valid firstname' })
  @IsOptional()
  firstname?: string;

  @IsString({ message: 'Please provide a valid lastname' })
  @IsOptional()
  lastname?: string;

  @IsString({ message: 'Please provide a valid username' })
  @IsOptional()
  username?: string;

  @IsString({ message: 'Please provide a valid phone number' })
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: 'Please provide a valid email' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Please provide a valid password' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional()
  password?: string;

}

export { UpdateUserDto };
