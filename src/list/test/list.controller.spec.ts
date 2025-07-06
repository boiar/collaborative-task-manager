import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListController } from '../list.controller';
import { ListEntity } from '../list.entity';
import { BoardEntity } from '../../board/board.entity';
import { UserEntity } from '../../user/user.entity';
import { DataSource } from 'typeorm';
import { BoardModule } from '../../board/board.module';
import { UserModule } from '../../user/user.module';
import { AuthModule } from '../../auth/auth.module';
import { ListModule } from '../list.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { NotificationEntity } from '../../notification/notification.entity';
import { CardEntity } from "../../card/card.entity";

describe('ListController (e2e)', () => {
  let module: TestingModule;
  let dataSource: DataSource;
  let controller: ListController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '3306', 10),
          username: process.env.DB_USERNAME || 'root',
          password: process.env.DB_PASSWORD || '1234',
          database: process.env.DB_NAME || 'trello_task',
          entities: [
            UserEntity,
            BoardEntity,
            ListEntity,
            CardEntity,
            NotificationEntity,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([
          UserEntity,
          BoardEntity,
          ListEntity,
          CardEntity,
          NotificationEntity,
        ]),
        UserModule,
        BoardModule,
        AuthModule,
        ListModule,
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: join(__dirname, '../../i18n/'), // adjust as needed
            watch: false,
          },
          resolvers: [{ use: HeaderResolver, options: ['lang'] }],
        }),
      ],
      controllers: [ListController],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    controller = module.get<ListController>(ListController);
  });

  beforeEach(async () => {
    // Clean tables before each test
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('DELETE FROM lists');
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

  it('should create list and return it', async () => {
    // Create user
    const userRepo = dataSource.getRepository(UserEntity);
    const user = await userRepo.save({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    // Create board first (required for list)
    const boardRepo = dataSource.getRepository(BoardEntity);
    const board = await boardRepo.save({
      title: 'Test Board',
      owner: user, // adjust if your BoardEntity requires owner relation
    });

    // DTO for list creation
    const createListDto = {
      title: 'Test List',
      position: 0,
      boardId: board.board_id, // or your board primary key
    };

    // Call your controller method (adjust parameters accordingly)
    const createdList = await controller.createList(
      user.user_id,
      createListDto,
    );

    expect(createdList).toBeDefined();
    expect(createdList.title).toBe(createListDto.title);

    // Optionally fetch the list from DB to double-check
    const listRepo = dataSource.getRepository(ListEntity);
    const listFromDb = await listRepo.findOneBy({
      list_id: createdList.list_id,
    });

    expect(listFromDb).not.toBeNull();
    expect(listFromDb!.title).toBe(createListDto.title);
  });

  it('should update list and return updated list', async () => {
    // Setup user, board, and list first
    const userRepo = dataSource.getRepository(UserEntity);
    const user = await userRepo.save({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    const boardRepo = dataSource.getRepository(BoardEntity);
    const board = await boardRepo.save({
      title: 'Test Board',
      owner: user,
    });

    const listRepo = dataSource.getRepository(ListEntity);
    const list = await listRepo.save({
      title: 'Initial List',
      position: 0,
      board: board,
    });

    const updateListDto = {
      title: 'Updated List Title',
    };

    const updatedList = await controller.updateList(
      user.user_id,
      list.list_id,
      updateListDto,
    );

    expect(updatedList).toBeDefined();
    expect(updatedList.title).toBe(updateListDto.title);

    const listFromDb = await listRepo.findOneBy({ list_id: list.list_id });
    expect(listFromDb!.title).toBe(updateListDto.title);
  });
});
