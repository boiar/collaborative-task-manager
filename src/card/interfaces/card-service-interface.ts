import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { CardResponseInterface } from './card-response.interface';

export interface ICardService {
  createCard(
    userId: number,
    data: CreateCardDto,
  ): Promise<CardResponseInterface>;

  updateCard(
    userId: number,
    cardId: number,
    data: UpdateCardDto,
  ): Promise<CardResponseInterface>;
}
