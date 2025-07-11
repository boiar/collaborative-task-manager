import { I18nService } from 'nestjs-i18n';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CardEntity } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { CardResponseInterface } from './interfaces/card-response.interface';
import { UpdateCardDto } from './dto/update-card.dto';
import { ICardService } from './interfaces/card-service-interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CardUpdatedEvent } from './events/card-updated.event';
import {
  IListRepositoryInterface,
  LIST_REPOSITORY,
} from '../list/interfaces/list-repository.interface';
import {
  CARD_REPOSITORY,
  ICardRepositoryInterface,
} from './interfaces/card-repository.interface';
import {
  BOARD_REPOSITORY,
  IBoardRepositoryInterface,
} from '../board/interfaces/board.repository.interface';
import {
  IUserRepositoryInterface,
  USER_REPOSITORY,
} from '../user/interfaces/user-repository.interface';

@Injectable()
export class CardService implements ICardService {
  constructor(
    @Inject(CARD_REPOSITORY)
    private cardRepo: ICardRepositoryInterface,
    @Inject(LIST_REPOSITORY)
    private listRepo: IListRepositoryInterface,
    @Inject(BOARD_REPOSITORY)
    private boardRepo: IBoardRepositoryInterface,
    @Inject(USER_REPOSITORY)
    private userRepo: IUserRepositoryInterface,
    private i18n: I18nService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async ensureCardList(card: CardEntity, listId: number) {
    if (card.list.list_id != listId) {
      throw new HttpException(
        await this.i18n.t('validation.card.cardNotBelongToList'),
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async createCard(
    userId: number,
    data: CreateCardDto,
  ): Promise<CardResponseInterface> {
    const list = await this.listRepo.findOne({
      where: { list_id: data.list_id },
    });

    if (!list) {
      throw new HttpException(
        await this.i18n.t('validation.list.invalidList'),
        HttpStatus.NOT_FOUND,
      );
    }

    const card = await this.cardRepo.create({
      ...data,
      list: list,
    });

    const saved = await this.cardRepo.save(card);
    const cardEntity = await this.cardRepo.findOne({
      where: { card_id: saved.card_id },
    });
    return cardEntity?.toResponseObject();
  }

  async updateCard(
    userId: number,
    cardId: number,
    data: UpdateCardDto,
  ): Promise<CardResponseInterface> {
    try {
      const card = await this.cardRepo.findOne({
        where: { card_id: cardId },
        relations: ['list'],
      });

      if (!card) {
        throw new HttpException(
          await this.i18n.t('validation.card.invalidCard'),
          HttpStatus.NOT_FOUND,
        );
      }

      await this.cardRepo.update(cardId, data);
      const updatedList = await this.cardRepo.findOneBy({ card_id: cardId });

      // Emit success event
      this.eventEmitter.emit(
        'card.updated',
        new CardUpdatedEvent(cardId, Date.now(), userId, true),
      );
      console.log('Event emitted: card.updated');

      return updatedList.toResponseObject();
    } catch (error) {
      // Emit failure event
      this.eventEmitter.emit(
        'card.updated',
        new CardUpdatedEvent(cardId, Date.now(), userId, false),
      );

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
