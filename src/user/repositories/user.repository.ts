import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { IUserRepositoryInterface } from '../interfaces/user-repository.interface';
import { UserEntity } from '../user.entity';

@Injectable()
export class UserRepository implements IUserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { user_id: id } });
  }

  findOne(options: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
    return this.repo.findOne(options);
  }

  findOneBy(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity | null> {
    return this.repo.findOneBy(where);
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    return this.repo.save(data);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.repo.update({ user_id: id }, data);
    return this.repo.findOne({ where: { user_id: id } });
  }

  save(data: UserEntity): Promise<UserEntity> {
    return this.repo.save(data);
  }
}
