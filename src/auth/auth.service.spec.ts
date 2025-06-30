import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { IfAnyOrNever } from 'nestjs-i18n/dist/types';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: any;
  let jwtService: JwtService;
  let i18nService: I18nService;

  beforeEach(async () => {
    mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    jwtService = new JwtService({ secret: 'supersecretkey' });
    i18nService = {
      translate: jest.fn((key) => key),
    } as any;

    service = new AuthService(mockUserRepo, jwtService, i18nService);
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const user = {
        email: 'test@example.com',
        password: await bcrypt.hash('pass123', 10),
      };
      mockUserRepo.findOne.mockResolvedValue(user);

      const result = await service.validateUser(user.email, 'pass123');
      expect(result).toHaveProperty('email', user.email);
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const result = await service.validateUser(
        'notfound@example.com',
        'pass123',
      );

      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const user = {
        email: 'test@example.com',
        password: await bcrypt.hash('wrongPass', 10),
      };
      mockUserRepo.findOne.mockResolvedValue(user);
      const result = await service.validateUser(user.email, 'pass123');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token for valid user', async () => {
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'secret',
      };
      const user = {
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        user_id: 1,
      };
      mockUserRepo.findOne.mockResolvedValue(user);
      const result = await service.login(loginDto);
      expect(result).toHaveProperty('access_token');
      expect(typeof result.access_token).toBe('string');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'invalid',
      };
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      const registerDto: RegisterDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      };

      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockImplementation((dto) => dto);
      mockUserRepo.save.mockImplementation((user) => ({
        ...user,
        user_id: 1,
      }));

      const result = await service.register(registerDto);
      expect(result).toHaveProperty('access_token');
    });

    it("should throw ConflictException if user already exists'", async () => {
      mockUserRepo.findOne.mockResolvedValue({ email: 'existing@example.com' });

      const registerDto: RegisterDto = {
        name: 'Test',
        email: 'existing@example.com',
        password: '123456',
      };

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
