import { Test } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ListEntity } from './list.entity';
import { BoardEntity } from '../board/board.entity';
import { UserEntity } from '../user/user.entity';
import { I18nService } from 'nestjs-i18n';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { BOARD_REPOSITORY } from "../board/interfaces/board-repository.interface";
import { LIST_REPOSITORY } from "./interfaces/list-repository.interface";
import { MockListRepository } from "./mocks/list.repository.mock";
import { MockBoardRepository } from "../board/mocks/mock-board.repository";
import { USER_REPOSITORY } from "../user/interfaces/user-repository.interface";
import { MockUserRepository } from "../user/mocks/user.repository.mock";

describe('ListService', () => {
  let listService: ListService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: LIST_REPOSITORY,
          useClass: MockListRepository, // or useValue/mock instance
        },
        {
          provide: BOARD_REPOSITORY,
          useClass: MockBoardRepository,
        },
        {
          provide: USER_REPOSITORY,
          useClass: MockUserRepository,
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn((key) => key),
          },
        },
      ],
    }).compile();

    listService = module.get(ListService);
  });

  it('should create list', async () => {
    const dto: CreateListDto = {
      boardId: 1,
      title: 'My Test List',
      position: 2,
    };

    const result = await listService.createList(1, dto);
    expect(result.title).toBe(dto.title);
    expect(result.position).toBe(dto.position);
    expect(result).toHaveProperty('create_at');
  });
});
