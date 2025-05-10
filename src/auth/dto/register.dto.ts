import { IsString, IsEmail, MinLength, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: 'validation.nameIsRequired' })
  name: string;

  @IsEmail({}, { message: 'validation.isEmail' })
  @IsNotEmpty({ message: 'validation.emailIsRequired' })
  email: string;

  @IsString({ message: 'validation.passwordMinLength' })
  @IsNotEmpty({ message: 'validation.passwordIsRequired' })
  @MinLength(6)
  password: string;
}
