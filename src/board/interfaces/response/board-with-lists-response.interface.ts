export interface BoardWithListsResponseInterface {
  board_id: number;
  title: string;
  create_at: Date;
  updated_at: Date;
  lists: {
    title: string;
    position: number;
  }[];
}
