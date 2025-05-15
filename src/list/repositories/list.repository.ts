import { Injectable } from '@nestjs/common';
import { IListRepositoryInterface } from '../interfaces/list-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { ListEntity } from '../list.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class ListRepository implements IListRepositoryInterface {
  constructor(
    @InjectRepository(ListEntity)
    private readonly repo: Repository<ListEntity>,
  ) {}

  findAll(): Promise<ListEntity[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<ListEntity | null> {
    return this.repo.findOne({ where: { list_id: id } });
  }

  findOne(options: FindOneOptions<ListEntity>): Promise<ListEntity | null> {
    return this.repo.findOne(options);
  }

  findOneBy(
    where: FindOptionsWhere<ListEntity> | FindOptionsWhere<ListEntity>[],
  ): Promise<ListEntity | null> {
    return this.repo.findOneBy(where);
  }

  async create(data: Partial<ListEntity>): Promise<ListEntity> {
    return this.repo.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async update(id: number, data: Partial<ListEntity>): Promise<ListEntity> {
    await this.repo.update({ list_id: id }, data);
    return this.repo.findOne({ where: { list_id: id } });
  }

  save(data: ListEntity): Promise<ListEntity> {
    return this.repo.save(data);
  }
}
