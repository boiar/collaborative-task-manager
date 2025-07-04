import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

describe('ListController', () => {
  let controller: ListController;
  let service: ListService;

  const mockListService = {
    createList: jest.fn(),
    updateList: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: 'IListService',
          useValue: mockListService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<ListController>(ListController);
    service = module.get<ListService>('IListService');
  });

  describe('createList', () => {
    it('should call service and return result', async () => {
      const dto: CreateListDto = { title: 'New List', position: 0, boardId: 1 };
      const expected = { list_id: 1, title: 'New List', position: 0 };

      mockListService.createList.mockResolvedValue(expected);

      const result = await controller.createList(1, dto);

      expect(service.createList).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('updateList', () => {
    it('should call service and return updated result', async () => {
      const dto: UpdateListDto = { title: 'Updated Title' };
      const expected = { list_id: 1, title: 'Updated Title', position: 0 };

      mockListService.updateList.mockResolvedValue(expected);

      const result = await controller.updateList(1, 1, dto);

      expect(service.updateList).toHaveBeenCalledWith(1, 1, dto);
      expect(result).toEqual(expected);
    });
  });
});
