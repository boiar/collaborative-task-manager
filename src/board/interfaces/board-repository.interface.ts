import { FindOneOptions } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { BoardEntity } from '../board.entity';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';

export const BOARD_REPOSITORY = 'BOARD_REPOSITORY';

export interface IBoardRepositoryInterface {
  findAll(options?: FindManyOptions<BoardEntity>): Promise<BoardEntity[]>;

  findById(id: number): Promise<BoardEntity | null>;
  findOne(options: FindOneOptions<BoardEntity>): Promise<BoardEntity | null>;

  findOneBy(
    where: FindOptionsWhere<BoardEntity> | FindOptionsWhere<BoardEntity>[],
  ): Promise<BoardEntity | null>;

  create(data: Partial<BoardEntity>): Promise<BoardEntity>;
  update(id: number, data: Partial<BoardEntity>): Promise<BoardEntity>;
  delete(id: number): Promise<void>;
  save(data: BoardEntity): Promise<BoardEntity>;
}
