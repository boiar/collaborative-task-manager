import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from '../notification.controller';
import { NotificationService } from '../notification.service';
import { NotificationModule } from '../notification.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../notification.entity'; // if needed
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../../user/user.entity';
import { BoardEntity } from '../../board/board.entity';
import { ListEntity } from '../../list/list.entity';
import { CardEntity } from '../../card/card.entity';
import { DataSource } from 'typeorm';

describe('NotificationController (integration)', () => {
  let controller: NotificationController;
  let service: NotificationService;
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME || 'root',
          password: process.env.DB_PASSWORD || '1234',
          database: process.env.DB_NAME || 'trello_task',
          entities: [
            NotificationEntity,
            UserEntity,
            BoardEntity,
            ListEntity,
            CardEntity,
          ],
          synchronize: true,
        }),
        NotificationModule,
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);

    dataSource = module.get<DataSource>(DataSource);
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('TRUNCATE TABLE notifications');
    await dataSource.query('TRUNCATE TABLE users');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');

    const userRepo = dataSource.getRepository(UserEntity);
    await userRepo.save({
      user_id: 1,
      name: 'Test User',
      email: 'test@example.com',
      password: '1234',
    });
  });

  afterAll(async () => {
    await module.close();
  });

  describe('sendDeadlineCardNotification', () => {
    it('should call sendDeadlineNotification and return its result', async () => {
      const body = { userId: 1, message: 'Test message' };

      const result = await controller.sendDeadlineCardNotification(body);

      expect(result).toBeDefined();
    });
  });
});
