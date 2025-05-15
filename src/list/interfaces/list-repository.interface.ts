import { ListEntity } from '../list.entity';
import { FindOneOptions } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export const LIST_REPOSITORY = 'LIST_REPOSITORY';

export interface IListRepositoryInterface {
  findAll(): Promise<ListEntity[]>;
  findById(id: number): Promise<ListEntity | null>;
  findOne(options: FindOneOptions<ListEntity>): Promise<ListEntity | null>;
  findOneBy(
    where: FindOptionsWhere<ListEntity> | FindOptionsWhere<ListEntity>[],
  ): Promise<ListEntity | null>;

  create(data: Partial<ListEntity>): Promise<ListEntity>;
  update(id: number, data: Partial<ListEntity>): Promise<ListEntity>;
  delete(id: number): Promise<void>;
  save(data: ListEntity): Promise<ListEntity>;
}
