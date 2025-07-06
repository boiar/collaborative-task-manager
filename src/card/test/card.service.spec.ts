import { CardService } from '../card.service';
import { CardRepositoryStub } from '../stubs/card-repository.stub';
import { ListRepositoryStub } from '../../list/stubs/list-repository.stub';
import { I18nService } from 'nestjs-i18n';
import { CreateCardDto } from '../dto/create-card.dto';
import { UpdateCardDto } from '../dto/update-card.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('CardService (with stub)', () => {
  let service: CardService;
  let cardRepo: CardRepositoryStub;
  let listRepo: ListRepositoryStub;
  let i18n: I18nService;
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    cardRepo = new CardRepositoryStub();
    listRepo = new ListRepositoryStub();

    // Mock i18n
    i18n = {
      t: async (key: string) => key,
    } as any;

    // Mock EventEmitter
    eventEmitter = {
      emit: jest.fn(),
    } as any;

    // Pass empty mocks for board/user repo since they're not used
    const boardRepo = {} as any;
    const userRepo = {} as any;

    service = new CardService(
      cardRepo,
      listRepo,
      boardRepo,
      userRepo,
      i18n,
      eventEmitter,
    );
  });

  it('should create a new card', async () => {
    const dto: CreateCardDto = {
      title: 'Test Card',
      list_id: 1,
      position: 1,
      description: 'Some desc',
      file_path: 'file.png',
      due_date: new Date(),
    };

    const result = await service.createCard(1, dto);

    expect(result).toHaveProperty('card_id');
    expect(result.title).toBe('Test Card');
  });

  it('should update an existing card and emit success event', async () => {
    const updateDto: UpdateCardDto = {
      title: 'Updated Title',
    };

    const updated = await service.updateCard(1, 1, updateDto);

    expect(updated.title).toBe('Updated Title');
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'card.updated',
      expect.objectContaining({
        cardId: 1,
        success: true,
        updatedBy: 1,
        updatedData: expect.any(Number),
      }),
    );
  });

  it('should throw if card not found and emit failure event', async () => {
    await expect(service.updateCard(1, 999, {})).rejects.toThrow();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      'card.updated',
      expect.objectContaining({
        cardId: 999,
        success: false,
      }),
    );
  });
});
