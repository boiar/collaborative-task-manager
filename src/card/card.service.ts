import { InjectRepository } from '@nestjs/typeorm';
import { ListEntity } from '../list/list.entity';
import { Repository } from 'typeorm';
import { BoardEntity } from '../board/board.entity';
import { UserEntity } from '../user/user.entity';
import { I18nService } from 'nestjs-i18n';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CardEntity } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { CardResponseInterface } from './interfaces/card-response.interface';
import { UpdateCardDto } from './dto/update-card.dto';
import { ICardService } from "./interfaces/card-service-interface";

@Injectable()
export class CardService implements ICardService{
  constructor(
    @InjectRepository(CardEntity)
    private cardRepo: Repository<CardEntity>,
    @InjectRepository(ListEntity)
    private listRepo: Repository<ListEntity>,
    @InjectRepository(BoardEntity)
    private boardRepo: Repository<BoardEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private i18n: I18nService,
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

    const savedCard = await this.cardRepo.save(card);

    return savedCard.toResponseObject();
  }

  async updateCard(
    userId: number,
    cardId: number,
    data: UpdateCardDto,
  ): Promise<CardResponseInterface> {
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

    await this.cardRepo.update({ card_id: cardId }, data);
    const updatedList = await this.cardRepo.findOneBy({ card_id: cardId });
    return updatedList.toResponseObject();
  }
}
