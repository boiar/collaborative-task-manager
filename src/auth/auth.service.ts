import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { I18nService } from 'nestjs-i18n';
import { IAuthService } from './interfaces/auth-service.interface';
import {
  IUserRepositoryInterface,
  USER_REPOSITORY,
} from '../user/interfaces/user-repository.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepo: IUserRepositoryInterface,
    private jwtService: JwtService,
    private readonly lang: I18nService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) {
      return null;
    }

    const { password, ...result } = user; // Omit password from response
    return result;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException(
        this.lang.translate('validation.invalidCredentials'),
      );
    }

    // Create payload for JWT token
    const payload = { email: user.email, sub: user.user_id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto): Promise<{ access_token: string }> {
    const { email, password, name } = registerDto;
    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      throw new ConflictException(
        this.lang.translate('validation.userAlreadyExists'),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepo.save(user);

    const payload = { email: savedUser.email, sub: savedUser.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
