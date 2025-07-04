import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  const mockCardService = {
    createCard: jest.fn(),
    updateCard: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: 'ICardService',
          useValue: mockCardService,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>('ICardService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call service.createCard with file path', async () => {
    const userId = 1;
    const dto: CreateCardDto = {
      title: 'Card Title',
      list_id: 2,
      position: 0,
      description: '',
      due_date: new Date(),
    };
    const file = { path: 'uploads/file.png' } as Express.Multer.File;

    const expectedResult = { card_id: 1, ...dto, file_path: file.path };
    mockCardService.createCard.mockResolvedValue(expectedResult);

    const result = await controller.createCard(userId, { ...dto }, file);
    expect(result).toEqual(expectedResult);
    expect(mockCardService.createCard).toHaveBeenCalledWith(userId, {
      ...dto,
      file_path: file.path,
    });
  });

  it('should call service.updateCard and logger.log with correct args', async () => {
    const userId = 1;
    const cardId = 99;
    const dto: UpdateCardDto = { title: 'Updated Title' };
    const file = { path: 'uploads/updated.png' } as Express.Multer.File;

    const expectedResult = { card_id: cardId, ...dto, file_path: file.path };
    mockCardService.updateCard.mockResolvedValue(expectedResult);

    const result = await controller.updateCard(
      userId,
      cardId,
      { ...dto },
      file,
    );

    expect(mockCardService.updateCard).toHaveBeenCalledWith(userId, cardId, {
      ...dto,
      file_path: file.path,
    });

    expect(mockLogger.log).toHaveBeenCalledWith(
      `User ${userId} is updating card ${cardId}`,
      {
        user: userId,
        card: cardId,
        changes: {
          ...dto,
          file_path: file.path,
        },
        action: 'update-card',
      },
    );

    expect(result).toEqual(expectedResult);
  });
});
