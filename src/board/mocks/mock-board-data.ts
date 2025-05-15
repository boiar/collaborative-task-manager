import { BoardEntity } from '../board.entity';
import { mockListData } from '../../list/mocks/mock-list-data';
import { mockUserData } from '../../user/mocks/mock-user-data';

// Create mock BoardEntity
const board = new BoardEntity();
board.board_id = 1;
board.title = 'Project Alpha';
board.owner = mockUserData;

// Use type assertions to bypass private access in mock context
(board as any).createdAt = new Date('2024-01-01T00:00:00Z');
(board as any).updatedAt = new Date('2024-01-02T00:00:00Z');

board.lists = mockListData;

// Override board methods with working context
board.toResponseObject = function () {
  return {
    board_id: this.board_id,
    title: this.title,
    create_at: (this as any).createdAt,
    updated_at: (this as any).updatedAt,
  };
};

board.boardWithListsToResponseObject = function () {
  return {
    board_id: this.board_id,
    title: this.title,
    create_at: (this as any).createdAt,
    updated_at: (this as any).updatedAt,
    lists: this.lists.map((list) => ({
      title: list.title,
      position: list.position,
    })),
  };
};

export const mockBoardData: BoardEntity[] = [board];
