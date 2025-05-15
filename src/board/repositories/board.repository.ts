import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { IBoardRepositoryInterface } from '../interfaces/board-repository.interface';
import { BoardEntity } from '../board.entity';
import { FindManyOptions } from "typeorm/find-options/FindManyOptions";

@Injectable()
export class BoardRepository implements IBoardRepositoryInterface {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly repo: Repository<BoardEntity>,
  ) {}

  findAll(options?: FindManyOptions<BoardEntity>): Promise<BoardEntity[]> {
    return this.repo.find(options);
  }

  findById(id: number): Promise<BoardEntity | null> {
    return this.repo.findOne({ where: { board_id: id } });
  }

  findOne(options: FindOneOptions<BoardEntity>): Promise<BoardEntity | null> {
    return this.repo.findOne(options);
  }

  findOneBy(
    where: FindOptionsWhere<BoardEntity> | FindOptionsWhere<BoardEntity>[],
  ): Promise<BoardEntity | null> {
    return this.repo.findOneBy(where);
  }

  async create(data: Partial<BoardEntity>): Promise<BoardEntity> {
    return this.repo.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async update(id: number, user: Partial<BoardEntity>): Promise<BoardEntity> {
    await this.repo.update({ board_id: id }, user);
    return this.repo.findOne({ where: { board_id: id } });
  }

  save(data: BoardEntity): Promise<BoardEntity> {
    return this.repo.save(data);
  }
}
