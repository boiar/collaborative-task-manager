import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './board.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { I18nService } from 'nestjs-i18n';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardResponseInterface } from './interfaces/board-response.interface';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardWithListsResponseInterface } from "./interfaces/board-with-lists-response.interface";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardRepo: Repository<BoardEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private readonly i18n: I18nService,
  ) {}

  private async ensureOwnership(board: BoardEntity, userId: number) {
    if (board.owner.user_id != userId) {
      throw new HttpException(
        await this.i18n.t('validation.board.youNotOwner'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async isValidUser(userId: number) {
    const user = await this.userRepo.findOneBy({ user_id: userId });
    if (!user) {
      throw new HttpException(
        await this.i18n.t('validation.invalidUser'),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getUserBoards(userId: number): Promise<BoardResponseInterface[]> {
    await this.isValidUser(userId);

    const boards = await this.boardRepo.find({
      where: {
        owner: {
          user_id: userId,
        },
      },
      relations: ['owner'],
    });

    return boards.map((board) => board.toResponseObject());
  }

  async getListsOfBoard(userId: number, boardId: number): Promise<BoardWithListsResponseInterface> {
    await this.isValidUser(userId);
    const boardLists = await this.boardRepo.findOne({
      where: {
        board_id: boardId,
      },
      relations: ['lists'],
    });

    return boardLists.boardWithListsToResponseObject();
  }

  async createUserBoard(
    userId: number,
    data: CreateBoardDto,
  ): Promise<BoardResponseInterface> {
    const user = await this.userRepo.findOneBy({ user_id: userId });
    if (!user) {
      throw new HttpException(
        await this.i18n.t('validation.invalidUser'),
        HttpStatus.NOT_FOUND,
      );
    }

    const board = await this.boardRepo.create({
      ...data,
      owner: user,
    });
    const savedBoard = await this.boardRepo.save(board);
    return savedBoard.toResponseObject();
  }

  async updateUserBoard(
    boardId: number,
    userId: number,
    data: UpdateBoardDto,
  ): Promise<BoardResponseInterface> {
    await this.isValidUser(userId);
    const board = await this.boardRepo.findOne({
      where: { board_id: boardId },
      relations: ['owner'],
    });

    if (!board) {
      throw new HttpException(
        await this.i18n.t('validation.board.invalidBoard'),
        HttpStatus.NOT_FOUND,
      );
    }

    await this.ensureOwnership(board, userId);
    await this.boardRepo.update({ board_id: boardId }, data);

    const updatedBoard = await this.boardRepo.findOneBy({ board_id: boardId });

    return updatedBoard.toResponseObject();
  }
}
