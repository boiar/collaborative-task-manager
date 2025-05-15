import { FindOneOptions } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { CardEntity } from '../card.entity';

export const CARD_REPOSITORY = 'CARD_REPOSITORY';

export interface ICardRepositoryInterface {
  findAll(): Promise<CardEntity[]>;
  findById(id: number): Promise<CardEntity | null>;
  findOne(options: FindOneOptions<CardEntity>): Promise<CardEntity | null>;

  findOneBy(
    where: FindOptionsWhere<CardEntity> | FindOptionsWhere<CardEntity>[],
  ): Promise<CardEntity | null>;

  create(data: Partial<CardEntity>): Promise<CardEntity>;
  update(id: number, data: Partial<CardEntity>): Promise<CardEntity>;
  delete(id: number): Promise<void>;
  save(data: CardEntity): Promise<CardEntity>;
}
