import { ListEntity } from '../list.entity';
import { mockBoardData } from '../../board/mocks/mock-board-data';

const list1 = new ListEntity();
list1.list_id = 1;
list1.title = 'To Do';
list1.position = 1;
list1.board = mockBoardData[0];
list1.cards = [];
list1['createdAt'] = new Date('2024-01-01T00:00:00Z');
list1['updatedAt'] = new Date('2024-01-02T00:00:00Z');
list1.toResponseObject = function () {
  return {
    list_id: this.list_id,
    title: this.title,
    position: this.position,
    create_at: this['createdAt'],
    updated_at: this['updatedAt'],
  };
};

const list2 = new ListEntity();
list2.list_id = 2;
list2.title = 'In Progress';
list2.position = 2;
list2.board = null;
list2.cards = [];
list2['createdAt'] = new Date('2024-02-01T00:00:00Z');
list2['updatedAt'] = new Date('2024-02-02T00:00:00Z');
list2.toResponseObject = function () {
  return {
    list_id: this.list_id,
    title: this.title,
    position: this.position,
    create_at: this['createdAt'],
    updated_at: this['updatedAt'],
  };
};

export const mockListData: ListEntity[] = [list1, list2];
