import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from '../board.service';
import { BoardRepositoryStub } from '../stubs/board-repository.stub';
import { UserRepositoryStub } from '../../user/stubs/user-repository.stub';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';
import { I18nService } from 'nestjs-i18n';

describe('BoardService (with stubs)', () => {
  let service: BoardService;

  const i18nMock = {
    t: jest.fn().mockResolvedValue('translated message'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        { provide: 'BOARD_REPOSITORY', useClass: BoardRepositoryStub },
        { provide: 'USER_REPOSITORY', useClass: UserRepositoryStub },
        {
          provide: I18nService,
          useValue: i18nMock,
        },
      ],
    }).compile();

    service = module.get(BoardService);
  });

  it('should create a new board for a valid user', async () => {
    const dto: CreateBoardDto = { title: 'New Test Board' };
    const board = await service.createUserBoard(1, dto);

    expect(board).toBeDefined();
    expect(board.title).toEqual('New Test Board');
    expect(board.board_id).toBeGreaterThan(0);
  });

  it('should return boards for a user', async () => {
    const result = await service.getUserBoards(1);

    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toHaveProperty('board_id');
    expect(result[0]).toHaveProperty('title');
  });

  it('should get lists of a board', async () => {
    const result = await service.getListsOfBoard(1, 1);

    expect(result.board_id).toBe(1);
    expect(result.lists.length).toBeGreaterThan(0);
    expect(result.lists[0]).toHaveProperty('title');
  });

  it('should update a user board if user is owner', async () => {
    const dto: UpdateBoardDto = { title: 'Updated Title' };
    const updated = await service.updateUserBoard(1, 1, dto);

    expect(updated.title).toBe('Updated Title');
  });
});
