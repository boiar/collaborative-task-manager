import { BoardController } from './board.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { BOARD_SERVICE } from './constants';

const mockBoardService = {
  getUserBoards: jest.fn().mockResolvedValue([
    {
      board_id: 1,
      title: 'Mock Board',
      create_at: new Date(),
      updated_at: new Date(),
    },
  ]),
  getListsOfBoard: jest.fn().mockResolvedValue({
    board_id: 1,
    title: 'Mock Board',
    create_at: new Date(),
    updated_at: new Date(),
    lists: [{ title: 'To Do', position: 1 }],
  }),
  createUserBoard: jest.fn().mockResolvedValue({
    board_id: 1,
    title: 'Created Board',
    create_at: new Date(),
    updated_at: new Date(),
  }),
  updateUserBoard: jest.fn().mockResolvedValue({
    board_id: 1,
    title: 'Updated Board',
    create_at: new Date(),
    updated_at: new Date(),
  }),
};

describe('BoardController', () => {
  let controller: BoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BOARD_SERVICE,
          useValue: mockBoardService,
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
  });

  it('should return a list of boards for a user', async () => {
    const result = await controller.getUserBoards(1);
    expect(result[0].title).toBe('Mock Board');
  });

  // Add tests for other controller methods similarly
});
