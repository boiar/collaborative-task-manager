import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from '../list.service';
import { I18nService } from 'nestjs-i18n';

import { LIST_REPOSITORY } from '../interfaces/list-repository.interface';
import { BOARD_REPOSITORY } from '../../board/interfaces/board.repository.interface';
import { USER_REPOSITORY } from '../../user/interfaces/user-repository.interface';

import { ListRepositoryStub } from '../stubs/list-repository.stub';
import { BoardRepositoryStub } from '../../board/stubs/board-repository.stub';
import { UserRepositoryStub } from '../../user/stubs/user-repository.stub';

describe('ListService', () => {
  let service: ListService;

  const mockI18nService = {
    t: jest.fn().mockImplementation((key) => Promise.resolve(key)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        { provide: LIST_REPOSITORY, useClass: ListRepositoryStub },
        { provide: BOARD_REPOSITORY, useClass: BoardRepositoryStub },
        { provide: USER_REPOSITORY, useClass: UserRepositoryStub },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<ListService>(ListService);
  });

  describe('createList', () => {
    it('should create a list when user is owner', async () => {
      const dto = { title: 'New List', position: 1, boardId: 1 };

      const result = await service.createList(1, dto);

      expect(result).toHaveProperty('list_id');
      expect(result.title).toBe('New List');
    });

    it('should throw if board is not found', async () => {
      await expect(
        service.createList(1, { title: 'List', boardId: 999, position: 0 }),
      ).rejects.toThrow('validation.board.invalidBoard');
    });
  });

  describe('updateList', () => {
    it('should update a list when user is owner', async () => {
      const dto = { title: 'Updated List' };

      const result = await service.updateList(1, 1, dto);

      expect(result).toHaveProperty('list_id');
      expect(result.title).toBe('Updated List');
    });

    it('should throw if list not found', async () => {
      await expect(service.updateList(1, 999, { title: 'X' })).rejects.toThrow(
        'validation.list.invalidList',
      );
    });
  });
});
