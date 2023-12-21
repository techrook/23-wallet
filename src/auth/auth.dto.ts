import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../utils/decorators/validators';
class Email {
  @IsEmail({}, { message: 'Please provide a valid email' })
  readonly email: string;
}
class CreateUserDto extends Email {
  @IsString({ message: 'Please provide a valid username' })
  username: string;

  @IsString({ message: 'Please provide a valid phone number' })
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Match('password', { message: 'Password not match' })
  passwordConfirm: string;
}

class LoginUserDto extends Email{
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
export {CreateUserDto, LoginUserDto}