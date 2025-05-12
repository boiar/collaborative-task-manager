export interface CardResponseInterface {
  card_id: number;
  title: string;
  due_to: Date;
  position: number;
  file_path: string;
  list: {
    list_id: number;
    title: string;
  };
}
