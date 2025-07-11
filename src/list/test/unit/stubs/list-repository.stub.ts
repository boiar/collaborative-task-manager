import { IListRepositoryInterface } from '../../../interfaces/list-repository.interface';
import { ListEntity } from '../../../list.entity';
import { BoardEntity } from '../../../../board/board.entity';

let mockLists: ListEntity[] = [];

function createListEntity(data: Partial<ListEntity>): ListEntity {
  const entity = new ListEntity();
  entity.list_id = data.list_id!;
  entity.title = data.title!;
  entity.position = data.position ?? 0;
  entity.board = data.board!;

  Object.defineProperty(entity, 'createdAt', {
    value: data.createdAt ?? new Date(),
    writable: false,
  });

  Object.defineProperty(entity, 'updatedAt', {
    value: data.updatedAt ?? new Date(),
    writable: false,
  });

  entity.toResponseObject = function () {
    return {
      list_id: this.list_id,
      title: this.title,
      position: this.position,
      create_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  };

  return entity;
}

export class ListRepositoryStub implements IListRepositoryInterface {
  constructor() {
    // Optional: Only seed if empty
    if (mockLists.length === 0) {
      this.seedInitialData();
    }
  }

  private seedInitialData() {
    const mockBoard = new BoardEntity();
    mockBoard.board_id = 1;

    mockLists.push(
      createListEntity({
        list_id: 1,
        title: 'Initial List',
        board: mockBoard,
        position: 0,
      }),
    );
  }

  async findAll(): Promise<ListEntity[]> {
    return mockLists;
  }

  async findById(id: number): Promise<ListEntity | null> {
    return mockLists.find((l) => l.list_id === id) || null;
  }

  async findOne(options: any): Promise<ListEntity | null> {
    const listId = options?.where?.list_id;
    const boardId = options?.where?.board?.board_id;

    if (listId) {
      return mockLists.find((l) => l.list_id === listId) || null;
    }

    if (boardId) {
      return mockLists.find((l) => l.board?.board_id === boardId) || null;
    }

    return null;
  }

  async findOneBy(where: any): Promise<ListEntity | null> {
    return this.findOne({ where });
  }

  async create(data: Partial<ListEntity>): Promise<ListEntity> {
    const newList = createListEntity({
      list_id: mockLists.length + 1,
      ...data,
    });

    mockLists.push(newList);
    return newList;
  }

  async save(data: ListEntity): Promise<ListEntity> {
    const index = mockLists.findIndex((l) => l.list_id === data.list_id);
    if (index >= 0) {
      mockLists[index] = data;
    } else {
      mockLists.push(data);
    }
    return data;
  }

  async delete(id: number): Promise<void> {
    mockLists = mockLists.filter((l) => l.list_id !== id);
  }

  async update(id: number, data: Partial<ListEntity>): Promise<ListEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('List not found');

    const updated = createListEntity({
      ...existing,
      ...data,
      list_id: id,
      board: existing.board,
    });

    return this.save(updated);
  }
}

// Optional test utilities
export function resetMockLists() {
  mockLists = [];
}

export function seedListForBoard(boardId: number, title = 'Test List') {
  const board = new BoardEntity();
  board.board_id = boardId;

  const list = createListEntity({
    list_id: mockLists.length + 1,
    title,
    board,
    position: 0,
  });

  mockLists.push(list);
  return list;
}
