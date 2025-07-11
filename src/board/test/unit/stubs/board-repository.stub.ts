import { IBoardRepositoryInterface } from '../../../interfaces/board.repository.interface';
import { BoardEntity } from '../../../board.entity';
import { FindOptionsWhere } from 'typeorm';
import { UserEntity } from '../../../../user/user.entity';
import { ListEntity } from '../../../../list/list.entity';

const mockUser: UserEntity = {
  user_id: 1,
  email: 'test@example.com',
  name: 'Mock User',
  password: '',
  boards: [],
  notifications: [],
};

// Internal mock store
let mockBoards: BoardEntity[] = [];

function createBoardEntity(data: Partial<BoardEntity>): BoardEntity {
  const entity = new BoardEntity();
  entity.board_id = data.board_id!;
  entity.title = data.title!;
  entity.owner = data.owner!;
  entity.lists = data.lists || [];
  Object.defineProperty(entity, 'createdAt', {
    value: data.createdAt || new Date(),
    writable: false,
  });
  Object.defineProperty(entity, 'updatedAt', {
    value: data.updatedAt || new Date(),
    writable: false,
  });

  entity.toResponseObject = function () {
    return {
      board_id: this.board_id,
      title: this.title,
      create_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  };

  entity.boardWithListsToResponseObject = function () {
    return {
      board_id: this.board_id,
      title: this.title,
      create_at: this.createdAt,
      updated_at: this.updatedAt,
      lists: this.lists.map((list: any) => ({
        title: list.title,
        position: list.position,
      })),
    };
  };

  return entity;
}

export class BoardRepositoryStub implements IBoardRepositoryInterface {
  constructor() {
    // Seed initial board
    if (mockBoards.length === 0) {
      mockBoards.push(
        createBoardEntity({
          board_id: 1,
          title: 'Stubbed Board',
          owner: mockUser,
          lists: [],
        }),
      );
    }
  }

  async findAll(): Promise<BoardEntity[]> {
    return mockBoards;
  }

  async findById(id: number): Promise<BoardEntity | null> {
    return mockBoards.find((b) => b.board_id === id) || null;
  }

  async findOne(options: any): Promise<BoardEntity | null> {
    const boardId = options?.where?.board_id;

    if (boardId === 1) {
      return createBoardEntity({
        board_id: 1,
        title: 'Board with Lists',
        owner: mockUser,
        lists: [{ title: 'List 1', position: 0 }] as any,
      });
    }

    return null;
  }

  async findOneBy(where: any): Promise<BoardEntity | null> {
    const boardId = where?.board_id;
    const userId = where?.owner?.user_id ?? mockUser.user_id;

    const board = mockBoards.find(
      (b) => b.board_id === boardId && b.owner?.user_id === userId,
    );

    return board || null;
  }

  async create(data: Partial<BoardEntity>): Promise<BoardEntity> {
    const newBoard = createBoardEntity({
      board_id: mockBoards.length + 1,
      title: data.title || 'Untitled',
      owner: data.owner || mockUser,
      lists: data.lists || [],
    });
    mockBoards.push(newBoard);
    return newBoard;
  }

  async save(data: BoardEntity): Promise<BoardEntity> {
    const index = mockBoards.findIndex((b) => b.board_id === data.board_id);
    if (index !== -1) {
      mockBoards[index] = data;
    } else {
      mockBoards.push(data);
    }
    return data;
  }

  async update(id: number, data: Partial<BoardEntity>): Promise<BoardEntity> {
    console.log('Updating board title to:', data.title);
    const existing = await this.findById(id);
    if (!existing) throw new Error('Board not found');

    const updated = createBoardEntity({
      board_id: id,
      title: data.title ?? existing.title,
      owner: existing.owner,
      lists: data.lists ?? existing.lists,
      createdAt: existing['createdAt'],
      updatedAt: new Date(),
    });

    await this.save(updated);
    return updated;
  }

  async delete(id: number): Promise<void> {
    mockBoards = mockBoards.filter((b) => b.board_id !== id);
  }
}
