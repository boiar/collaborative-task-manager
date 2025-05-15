import { IBoardRepositoryInterface } from '../interfaces/board-repository.interface';
import { BoardEntity } from '../board.entity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOneOptions } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { mockBoardData } from './mock-board-data';

export class MockBoardRepository implements IBoardRepositoryInterface {
  private data: BoardEntity[] = [...mockBoardData];

  async create(data: Partial<BoardEntity>): Promise<BoardEntity> {
    const newBoard = new BoardEntity();
    Object.assign(newBoard, data);
    newBoard.board_id = this.data.length + 1; // simple id increment
    this.data.push(newBoard);
    return newBoard;
  }

  async delete(id: number): Promise<void> {
    this.data = this.data.filter((board) => board.board_id !== id);
  }

  async findAll(
    options?: FindManyOptions<BoardEntity>,
  ): Promise<BoardEntity[]> {
    // For simplicity ignoring options (like relations, order, etc.)
    return [...this.data];
  }

  async findById(id: number): Promise<BoardEntity | null> {
    const board = this.data.find((b) => b.board_id === id);
    return board ?? null;
  }

  async findOne(
    options: FindOneOptions<BoardEntity>,
  ): Promise<BoardEntity | null> {
    // naive implementation using where condition only
    if (options.where) {
      const where = options.where as Partial<BoardEntity>;
      const board = this.data.find((b) => {
        return Object.entries(where).every(
          ([key, value]) => b[key as keyof BoardEntity] === value,
        );
      });
      return board ?? null;
    }
    return null;
  }

  async findOneBy(
    where: FindOptionsWhere<BoardEntity> | FindOptionsWhere<BoardEntity>[],
  ): Promise<BoardEntity | null> {
    if (Array.isArray(where)) {
      for (const condition of where) {
        const found = await this.findOne({ where: condition });
        if (found) return found;
      }
      return null;
    } else {
      return this.findOne({ where });
    }
  }

  async save(data: BoardEntity): Promise<BoardEntity> {
    const index = this.data.findIndex((b) => b.board_id === data.board_id);
    if (index !== -1) {
      this.data[index] = data;
    } else {
      this.data.push(data);
    }
    return data;
  }

  async update(id: number, data: Partial<BoardEntity>): Promise<BoardEntity> {
    const board = this.data.find((b) => b.board_id === id);
    if (!board) {
      return null;
    }
    Object.assign(board, data);
    return board;
  }
}
