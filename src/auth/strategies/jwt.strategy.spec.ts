import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeAll(() => {
    process.env.APP_SECRET_KEY = 'supersecretkey';
    const configService = new ConfigService();
    strategy = new JwtStrategy(configService);
  });

  afterAll(() => {
    delete process.env.APP_SECRET_KEY;
  });

  it('should construct successfully with a valid secret', () => {
    expect(strategy).toBeInstanceOf(JwtStrategy);
  });

  it('should validate and return user data from payload', async () => {
    const payload = { sub: '123', email: 'user@example.com' };

    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: '123', email: 'user@example.com' });
  });

  it('should throw UnauthorizedException if payload is invalid', async () => {
    await expect(strategy.validate({ sub: '', email: '' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
