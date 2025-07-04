import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BoardEntity } from '../board/board.entity';
import { I18nService } from 'nestjs-i18n';
import { ListResponseInterface } from './interfaces/list-response.interface';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { IListService } from './interfaces/list-service.interface';
import {
  IListRepositoryInterface,
  LIST_REPOSITORY,
} from './interfaces/list-repository.interface';
import {
  BOARD_REPOSITORY,
  IBoardRepositoryInterface,
} from '../board/interfaces/board.repository.interface';
import {
  IUserRepositoryInterface,
  USER_REPOSITORY,
} from '../user/interfaces/user-repository.interface';

@Injectable()
export class ListService implements IListService {
  constructor(
    @Inject(LIST_REPOSITORY)
    private readonly listRepo: IListRepositoryInterface,
    @Inject(BOARD_REPOSITORY)
    private boardRepo: IBoardRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private userRepo: IUserRepositoryInterface,
    private i18n: I18nService,
  ) {}

  public async ensureOwnership(board: BoardEntity, userId: number) {
    if (board.owner.user_id != userId) {
      throw new HttpException(
        await this.i18n.t('validation.board.youNotOwner'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createList(
    userId: number,
    data: CreateListDto,
  ): Promise<ListResponseInterface> {
    const board = await this.boardRepo.findOne({
      where: { board_id: data.boardId },
      relations: ['owner'],
    });

    if (!board) {
      throw new HttpException(
        await this.i18n.t('validation.board.invalidBoard'),
        HttpStatus.NOT_FOUND,
      );
    }
    await this.ensureOwnership(board, userId);

    const list = await this.listRepo.create({
      ...data,
      board: board,
    });

    const savedList = await this.listRepo.save(list);

    return savedList.toResponseObject();
  }

  async updateList(
    userId: number,
    listId: number,
    data: UpdateListDto,
  ): Promise<ListResponseInterface> {
    const list = await this.listRepo.findOne({
      where: { list_id: listId },
      relations: ['board'],
    });

    if (!list) {
      throw new HttpException(
        await this.i18n.t('validation.list.invalidList'),
        HttpStatus.NOT_FOUND,
      );
    }

    const board = await this.boardRepo.findOne({
      where: { board_id: list.board.board_id },
      relations: ['owner'],
    });

    await this.ensureOwnership(board, userId);

    await this.listRepo.update(listId, data);
    const updatedList = await this.listRepo.findOneBy({ list_id: listId });

    return updatedList.toResponseObject();
  }
}
