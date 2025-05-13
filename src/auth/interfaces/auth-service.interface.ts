import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<{ access_token: string }>;
  register(registerDto: RegisterDto): Promise<{ access_token: string }>;
  validateUser(email: string, password: string): Promise<any>;
}
