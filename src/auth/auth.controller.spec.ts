import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IAuthService } from './interfaces/auth-service.interface';
import { AuthServiceStub } from './stubs/auth.service.stub';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: IAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService, // MATCH THIS WITH THE CONTROLLER INJECTION
          useClass: AuthServiceStub,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<IAuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })

  it('login should return a mocked access_token string', async () => {
    const result = await controller.login({ email: 'test@example.com', password: 'password123' });
    expect(result).toEqual({ access_token: 'mocked_token_for_1' });
  });

  it('register should return a mocked access_token string', async () => {
    const result = await controller.register({
      name: 'New User',
      email: 'new@example.com',
      password: 'newpass',
    });
    expect(result).toEqual({ access_token: 'mocked_token_for_2' });
  });
});
