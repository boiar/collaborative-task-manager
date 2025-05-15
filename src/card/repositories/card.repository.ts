import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ICardRepositoryInterface } from '../interfaces/card-repository.interface';
import { CardEntity } from '../card.entity';

@Injectable()
export class CardRepository implements ICardRepositoryInterface {
  constructor(
    @InjectRepository(CardEntity)
    private readonly repo: Repository<CardEntity>,
  ) {}

  findAll(): Promise<CardEntity[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<CardEntity | null> {
    return this.repo.findOne({ where: { card_id: id } });
  }

  findOne(options: FindOneOptions<CardEntity>): Promise<CardEntity | null> {
    return this.repo.findOne(options);
  }

  findOneBy(
    where: FindOptionsWhere<CardEntity> | FindOptionsWhere<CardEntity>[],
  ): Promise<CardEntity | null> {
    return this.repo.findOneBy(where);
  }

  async create(data: Partial<CardEntity>): Promise<CardEntity> {
    return this.repo.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async update(id: number, user: Partial<CardEntity>): Promise<CardEntity> {
    await this.repo.update({ card_id: id }, user);
    return this.repo.findOne({ where: { card_id: id } });
  }

  save(data: CardEntity): Promise<CardEntity> {
    return this.repo.save(data);
  }
}
