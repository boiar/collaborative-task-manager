import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from '../card.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardEntity } from '../card.entity';
import { ListEntity } from '../../list/list.entity';
import { UserEntity } from '../../user/user.entity';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { I18nModule, HeaderResolver } from 'nestjs-i18n';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BoardEntity } from '../../board/board.entity';
import { NotificationEntity } from '../../notification/notification.entity';
import { CardModule } from '../card.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigModule } from '@nestjs/config';


describe('CardController (e2e)', () => {
  let module: TestingModule;
  let controller: CardController;
  let dataSource: DataSource;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql', // or 'sqlite' for simpler testing
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
        CardModule,
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: join(__dirname, '../../i18n/'),
            watch: false,
          },
          resolvers: [{ use: HeaderResolver, options: ['lang'] }],
        }),
      ],
      providers: [
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            info: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
      controllers: [CardController],
    }).compile();

    controller = module.get<CardController>(CardController);
    dataSource = module.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    // clean DB before each test
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    await dataSource.query('DELETE FROM cards');
    await dataSource.query('DELETE FROM lists');
    await dataSource.query('DELETE FROM users');
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a card and return it', async () => {
    // prepare repositories
    const userRepo = dataSource.getRepository(UserEntity);
    const listRepo = dataSource.getRepository(ListEntity);

    // create user and list first
    const user = await userRepo.save({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    const list = await listRepo.save({
      title: 'Test List',
      position: 0,
      board: null, // if needed, create a board or adjust accordingly
    });

    const createCardDto = {
      title: 'Card Title',
      list_id: list.list_id,
      position: 0,
      description: '',
      due_date: new Date(),
    };

    // simulate file (for file_path)
    const file = { path: 'uploads/file.png' } as Express.Multer.File;

    const createdCard = await controller.createCard(
      user.user_id,
      createCardDto,
      file,
    );

    expect(createdCard).toBeDefined();
    expect(createdCard.title).toBe(createCardDto.title);

    const FILE_BASE_URL = process.env.FILE_BASE_URL || 'http://localhost:3000';
    expect(createdCard.file_path).toBe(`${FILE_BASE_URL}/${file.path}`);

    // you can also verify DB state if you want
  });

  it('should update a card and return updated', async () => {
    const userRepo = dataSource.getRepository(UserEntity);
    const listRepo = dataSource.getRepository(ListEntity);
    const cardRepo = dataSource.getRepository(CardEntity);

    const user = await userRepo.save({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });

    const list = await listRepo.save({
      title: 'Test List',
      position: 0,
      board: null,
    });

    const card = await cardRepo.save({
      title: 'Old Title',
      list: list,
      position: 0,
    });

    const updateCardDto = {
      title: 'Updated Title',
    };

    const file = { path: 'uploads/updated.png' } as Express.Multer.File;

    const updatedCard = await controller.updateCard(
      user.user_id,
      card.card_id,
      updateCardDto,
      file,
    );

    expect(updatedCard).toBeDefined();
    expect(updatedCard.title).toBe(updateCardDto.title);

    const FILE_BASE_URL = process.env.FILE_BASE_URL || 'http://localhost:3000';
    expect(updatedCard.file_path).toBe(`${FILE_BASE_URL}/${file.path}`);
    const cardFromDb = await cardRepo.findOneBy({ card_id: card.card_id });
    expect(cardFromDb!.title).toBe(updateCardDto.title);
  });
});
