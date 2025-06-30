import { IAuthService } from '../interfaces/auth-service.interface';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export class AuthServiceStub implements IAuthService {
  private users: Array<{ email: string; password: string; name: string; user_id: number }> = [
    { email: 'test@example.com', password: 'password123', name: 'Test User', user_id: 1 },
  ];

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const user = this.users.find(
      (u) => u.email === loginDto.email && u.password === loginDto.password,
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return Promise.resolve({ access_token: 'mocked_token_for_' + user.user_id });
  }

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const exists = this.users.find((u) => u.email === registerDto.email);
    if (exists) {
      throw new Error('User already exists');
    }

    const newUser = {
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
      user_id: this.users.length + 1,
    };

    this.users.push(newUser);

    return Promise.resolve({ access_token: 'mocked_token_for_' + newUser.user_id });
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.users.find((u) => u.email === email && u.password === password);
    if (user) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }
}
