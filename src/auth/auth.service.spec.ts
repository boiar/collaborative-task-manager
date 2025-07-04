import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryStub } from '../user/stubs/user-repository.stub';
import * as bcrypt from 'bcrypt';

describe('AuthService with UserRepositoryStub', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let i18nService: I18nService;
  let userRepo: UserRepositoryStub;

  beforeEach(() => {
    userRepo = new UserRepositoryStub();

    jwtService = new JwtService({ secret: 'test_secret' });

    i18nService = {
      translate: jest.fn((key: string) => key),
    } as unknown as I18nService;

    jest.spyOn(bcrypt, 'compare').mockImplementation(async (plain, hashed) => {
      if (
        plain === 'fakehashedpassword' &&
        hashed === '$2b$10$fakehashedpassword'
      ) {
        return true;
      }
      return false;
    });

    authService = new AuthService(userRepo, jwtService, i18nService);
  });

  describe('validateUser()', () => {
    it('should return user without password when credentials are valid', async () => {
      const result = await authService.validateUser(
        'existing@example.com',
        'fakehashedpassword',
      );

      expect(result).toMatchObject({ email: 'existing@example.com' });
      expect(result).not.toHaveProperty('password');
    });

    it('should return null if user is not found', async () => {
      const result = await authService.validateUser(
        'nonexistent@example.com',
        'pass123',
      );
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const result = await authService.validateUser(
        'existing@example.com',
        'wrongpass',
      );
      expect(result).toBeNull();
    });
  });

  describe('login()', () => {
    it('should return access token for valid user', async () => {
      const loginDto: LoginDto = {
        email: 'existing@example.com',
        password: 'fakehashedpassword',
      };

      const result = await authService.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(typeof result.access_token).toBe('string');
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'missing@example.com',
        password: 'invalid',
      };

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register()', () => {
    it('should register a new user and return access token', async () => {
      const registerDto: RegisterDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword',
      };

      const result = await authService.register(registerDto);

      expect(result).toHaveProperty('access_token');
      expect(typeof result.access_token).toBe('string');
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        name: 'Existing',
        email: 'existing@example.com',
        password: 'anything',
      };

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
