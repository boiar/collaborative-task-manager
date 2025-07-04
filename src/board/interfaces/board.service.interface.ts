import { BoardResponseInterface } from './response/board-response.interface';
import { BoardWithListsResponseInterface } from './response/board-with-lists-response.interface';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';

export interface IBoardService {
  getUserBoards(userId: number): Promise<BoardResponseInterface[]>;

  getListsOfBoard(
    userId: number,
    boardId: number,
  ): Promise<BoardWithListsResponseInterface>;

  createUserBoard(
    userId: number,
    data: CreateBoardDto,
  ): Promise<BoardResponseInterface>;

  updateUserBoard(
    boardId: number,
    userId: number,
    data: UpdateBoardDto,
  ): Promise<BoardResponseInterface>;
}
