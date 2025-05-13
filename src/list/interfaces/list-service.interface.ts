import { CreateListDto } from '../dto/create-list.dto';
import { UpdateListDto } from '../dto/update-list.dto';
import { ListResponseInterface } from './list-response.interface';

export interface IListService {
  createList(
    userId: number,
    data: CreateListDto,
  ): Promise<ListResponseInterface>;
  updateList(
    userId: number,
    listId: number,
    data: UpdateListDto,
  ): Promise<ListResponseInterface>;
}
