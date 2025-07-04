import { ICardRepositoryInterface } from '../interfaces/card-repository.interface';
import { CardEntity } from '../card.entity';
import { ListEntity } from '../../list/list.entity';

let mockCards: CardEntity[] = [];

function createCardEntity(data: Partial<CardEntity>): CardEntity {
  const entity = new CardEntity();
  entity.card_id = data.card_id!;
  entity.title = data.title!;
  entity.description = data.description ?? '';
  entity.due_date = data.due_date ?? null;
  entity.position = data.position ?? 0;
  entity.file_path = data.file_path ?? null;
  entity.list = data.list!;

  entity.toResponseObject = function () {
    const baseUrl = process.env.FILE_BASE_URL || 'http://localhost:3000';
    const filePath = this.file_path ? `${baseUrl}/${this.file_path}` : null;

    return {
      card_id: this.card_id,
      title: this.title,
      due_to: this.due_date,
      position: this.position,
      file_path: filePath,
      list: {
        list_id: this.list?.list_id,
        title: this.list?.title,
      },
    };
  };

  return entity;
}

export class CardRepositoryStub implements ICardRepositoryInterface {
  constructor() {
    if (mockCards.length === 0) {
      const list = new ListEntity();
      list.list_id = 1;

      mockCards.push(
        createCardEntity({
          card_id: 1,
          title: 'Initial Card',
          description: 'This is a card',
          list: list,
        }),
      );
    }
  }

  async findAll(): Promise<CardEntity[]> {
    return mockCards;
  }

  async findById(id: number): Promise<CardEntity | null> {
    return mockCards.find((c) => c.card_id === id) || null;
  }

  async findOne(options: any): Promise<CardEntity | null> {
    const id = options?.where?.card_id;
    return mockCards.find((c) => c.card_id === id) || null;
  }

  async findOneBy(where: any): Promise<CardEntity | null> {
    return this.findOne({ where });
  }

  async create(data: Partial<CardEntity>): Promise<CardEntity> {
    const newCard = createCardEntity({
      card_id: mockCards.length + 1,
      ...data,
    });

    mockCards.push(newCard);
    return newCard;
  }

  async save(data: CardEntity): Promise<CardEntity> {
    const index = mockCards.findIndex((c) => c.card_id === data.card_id);
    if (index >= 0) mockCards[index] = data;
    else mockCards.push(data);
    return data;
  }

  async delete(id: number): Promise<void> {
    mockCards = mockCards.filter((c) => c.card_id !== id);
  }

  async update(id: number, data: Partial<CardEntity>): Promise<CardEntity> {
    const existing = await this.findById(id);
    if (!existing) throw new Error('Card not found');

    const updated = createCardEntity({
      ...existing,
      ...data,
      card_id: id,
      list: existing.list,
    });

    return this.save(updated);
  }
}
