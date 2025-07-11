import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from '../../board.controller';
import { BoardService } from '../../board.service';
import { BoardEntity } from '../../board.entity';
import { UserEntity } from '../../../user/user.entity';
import { NotificationEntity } from '../../../notification/notification.entity';
import { ListEntity } from '../../../list/list.entity';
import { CardEntity } from '../../../card/card.entity';
import { I18nModule, HeaderResolver } from 'nestjs-i18n';
import { join } from 'path';
import { AuthModule } from '../../../auth/auth.module';
import { UserModule } from '../../../user/user.module';
import { DataSource } from 'typeorm';
import { BoardRepository } from '../../board.repository';
import { UserRepository } from '../../../user/repositories/user.repository';
import {
  BOARD_REPOSITORY,
} from '../../interfaces/board.repository.interface';
import {
  USER_REPOSITORY,
} from '../../../user/interfaces/user-repository.interface';

describe('BoardController (e2e)', () => {
  let module: TestingModule;
  let dataSource: DataSource;
  let controller: BoardController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
        }),
        TypeOrmModule.forFeature([
          UserEntity,
          BoardEntity,
          NotificationEntity,
          ListEntity,
          CardEntity,
        ]),
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
      controllers: [BoardController],
      providers: [
        { provide: 'IBoardService', useClass: BoardService },
        { provide: BOARD_REPOSITORY, useClass: BoardRepository },
        { provide: USER_REPOSITORY, useClass: UserRepository },
      ],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    controller = module.get<BoardController>(BoardController);
  });

  beforeEach(async () => {
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('DELETE FROM cards');
    await dataSource.query('DELETE FROM lists');
    await dataSource.query('DELETE FROM notifications');
    await dataSource.query('DELETE FROM boards');
    await dataSource.query('DELETE FROM users');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create and get user boards', async () => {
    const user = await dataSource.getRepository(UserEntity).save({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const boardDto = { title: 'Live Board' };
    await controller.createUserBoard(user.user_id, boardDto);

    const boards = await controller.getUserBoards(user.user_id);

    expect(boards.length).toBeGreaterThan(0);
    expect(boards[0].title).toBe('Live Board');
  });
});
