import { UserEntity } from '../user.entity';
import { mockBoardData } from '../../board/mocks/mock-board-data';

const user = new UserEntity();
user.user_id = 1;
user.name = 'mock_user';
user.email = 'mock_user@example.com';
user.password = 'hashedpassword'; // simulate a hashed password
user.boards = mockBoardData;

// Ensure mockBoardData is an array, otherwise wrap it into one
const boards = Array.isArray(mockBoardData) ? mockBoardData : [mockBoardData];

// Assign user as owner to each board and also set the user's boards array
boards.forEach((board) => {
  if (board) {
    // only assign if board is not undefined or null
    board.owner = user;
  }
});

user.boards = boards;
export const mockUserData: UserEntity = user;
