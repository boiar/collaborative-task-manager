import { FindOneOptions } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { UserEntity } from '../user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepositoryInterface {
  findAll(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity | null>;
  findOneBy(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity | null>;

  create(data: Partial<UserEntity>): Promise<UserEntity>;
  update(id: number, data: Partial<UserEntity>): Promise<UserEntity>;
  delete(id: number): Promise<void>;
  save(data: UserEntity): Promise<UserEntity>;
}
