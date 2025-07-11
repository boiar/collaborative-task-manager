import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../auth.service';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { UserEntity } from '../../../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { UserModule } from '../../../user/user.module';
import { AuthModule } from '../../auth.module';
import { BoardEntity } from '../../../board/board.entity';
import { NotificationEntity } from '../../../notification/notification.entity';
import { ListEntity } from '../../../list/list.entity';
import { CardEntity } from '../../../card/card.entity';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let authController: AuthController;
  let authService: IAuthService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          charset: 'utf8mb4',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME || 'root',
          password: process.env.DB_PASSWORD || '1234',
          database: process.env.DB_NAME || 'trello_task',
          entities: [
            UserEntity,
            BoardEntity,
            NotificationEntity,
            ListEntity,
            CardEntity,
          ],
          synchronize: true,
          autoLoadEntities: true,
        }),
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1h' },
        }),
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: join(__dirname, '../../../i18n/'),
            watch: false,
          },
          resolvers: [{ use: HeaderResolver, options: ['lang'] }],
        }),
        UserModule,
        AuthModule,
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<IAuthService>(AuthService);
    dataSource = moduleRef.get<DataSource>(getDataSourceToken());

    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource
      .getRepository(BoardEntity)
      .createQueryBuilder()
      .delete()
      .execute();
    await dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .delete()
      .execute();
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register()', () => {
    it('should return an access_token string', async () => {
      const result = await authController.register({
        name: 'New User',
        email: 'new@example.com',
        password: 'newpass',
      });

      expect(result).toHaveProperty('access_token');
      expect(typeof result.access_token).toBe('string');
    });
  });

  describe('login()', () => {
    it('should return an access_token string after registering a user', async () => {
      const uniqueEmail = `test+${Date.now()}@example.com`;

      await authController.register({
        name: 'New User',
        email: uniqueEmail,
        password: 'password123',
      });

      const result = await authController.login({
        email: uniqueEmail,
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(typeof result.access_token).toBe('string');
    });
  });
});
