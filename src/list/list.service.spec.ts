import { Test } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { getRepositoryToken } from "@nestjs/typeorm";
import { ListEntity } from "./list.entity";
import { BoardEntity } from "../board/board.entity";
import { UserEntity } from "../user/user.entity";
import { I18nService } from 'nestjs-i18n';
import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('ListService', () => {
  let listService: ListService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getRepositoryToken(ListEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BoardEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn((key) => key),
          },
        },
      ],
    }).compile();

    listService = moduleRef.get(ListService);
  });






});
