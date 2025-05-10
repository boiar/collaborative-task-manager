import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'validation.emailIsRequired' })
  @IsEmail({}, { message: 'validation.isEmail' })
  email: string;

  @IsNotEmpty({ message: 'validation.passwordIsRequired' })
  @MinLength(6, { message: 'validation.passwordMinLength' })
  password: string;
}
