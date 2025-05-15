// test/mocks/mock-list-data.ts
import { ListEntity } from '../list.entity';

export const mockListData: ListEntity[] = [
  {
    list_id: 1,
    title: 'To Do',
    position: 1,
    board: null,
    cards: [],
    // Simulate private fields
    ['createdAt']: new Date('2024-01-01T00:00:00Z'),
    ['updatedAt']: new Date('2024-01-02T00:00:00Z'),
    toResponseObject() {
      return {
        list_id: this.list_id,
        title: this.title,
        position: this.position,
        create_at: this.createdAt,
        updated_at: this.updatedAt,
      };
    },
  },
  {
    list_id: 2,
    title: 'In Progress',
    position: 2,
    board: null,
    cards: [],
    ['createdAt']: new Date('2024-02-01T00:00:00Z'),
    ['updatedAt']: new Date('2024-02-02T00:00:00Z'),
    toResponseObject() {
      return {
        list_id: this.list_id,
        title: this.title,
        position: this.position,
        create_at: this.createdAt,
        updated_at: this.updatedAt,
      };
    },
  },
];
