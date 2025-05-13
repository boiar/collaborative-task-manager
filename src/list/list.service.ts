import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListEntity } from './list.entity';
import { Repository } from 'typeorm';
import { BoardEntity } from '../board/board.entity';
import { UserEntity } from '../user/user.entity';
import { I18nService } from 'nestjs-i18n';
import { ListResponseInterface } from './interfaces/list-response.interface';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { IListService } from './interfaces/list-service.interface';

@Injectable()
export class ListService implements IListService {
  constructor(
    @InjectRepository(ListEntity)
    private listRepo: Repository<ListEntity>,
    @InjectRepository(BoardEntity)
    private boardRepo: Repository<BoardEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private i18n: I18nService,
  ) {}

  private async ensureOwnership(board: BoardEntity, userId: number) {
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
    const board = await this.boardRepo
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .where('board.board_id = :id', { id: data.boardId })
      .getOne();

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

    const board = await this.boardRepo
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .where('board.board_id = :id', { id: list.board.board_id })
      .getOne();

    await this.ensureOwnership(board, userId);

    await this.listRepo.update({ list_id: listId }, data);
    const updatedList = await this.listRepo.findOneBy({ list_id: listId });

    return updatedList.toResponseObject();
  }
}
