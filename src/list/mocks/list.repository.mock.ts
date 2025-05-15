// test/mocks/mock-list.repository.ts
import { IListRepositoryInterface } from '../interfaces/list-repository.interface';
import { ListEntity } from '../list.entity';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { mockListData } from './mock-list-data';

export class MockListRepository implements IListRepositoryInterface {
  private data: ListEntity[] = mockListData;

  async create(data: Partial<ListEntity>): Promise<ListEntity> {
    const newList = new ListEntity();

    // Assign provided data fields to newList instance
    Object.assign(newList, data);

    newList.list_id = this.data.length + 1;
    newList.cards = [];
    newList.board = null;

    // Private fields set by Object.assign (runtime, bypass TS)
    Object.assign(newList, {
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Add your toResponseObject method
    newList.toResponseObject = function () {
      return {
        list_id: this.list_id,
        title: this.title,
        position: this.position,
        create_at: this.createdAt,
        updated_at: this.updatedAt,
      };
    };

    // Add newList to internal mock data array
    this.data.push(newList);

    // RETURN the new entity instance wrapped in a Promise (async method auto-wraps)
    return newList;
  }

  async delete(id: number): Promise<void> {
    this.data = this.data.filter((list) => list.list_id !== id);
  }

  async findAll(): Promise<ListEntity[]> {
    return this.data;
  }

  async findById(id: number): Promise<ListEntity | null> {
    return this.data.find((list) => list.list_id === id) || null;
  }

  async findOne(
    options: FindOneOptions<ListEntity>,
  ): Promise<ListEntity | null> {
    const where = options.where as any;
    return (
      this.data.find((list) =>
        Object.entries(where).every(([key, value]) => list[key] === value),
      ) || null
    );
  }

  async findOneBy(
    where: FindOptionsWhere<ListEntity> | FindOptionsWhere<ListEntity>[],
  ): Promise<ListEntity | null> {
    const whereObj = Array.isArray(where) ? where[0] : where;
    return (
      this.data.find((list) =>
        Object.entries(whereObj).every(([key, value]) => list[key] === value),
      ) || null
    );
  }

  async save(data: ListEntity): Promise<ListEntity> {
    const index = this.data.findIndex((item) => item.list_id === data.list_id);
    if (index !== -1) {
      this.data[index] = data;
    } else {
      this.data.push(data);
    }
    return data;
  }

  async update(
    id: number,
    updateData: Partial<ListEntity>,
  ): Promise<ListEntity> {
    const list = await this.findById(id);
    if (!list) return null;
    Object.assign(list, updateData, {
      ['updatedAt']: new Date(),
    });
    return list;
  }
}
