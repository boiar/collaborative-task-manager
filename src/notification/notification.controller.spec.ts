import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  const mockNotificationService = {
    sendDeadlineNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  describe('sendDeadlineCardNotification', () => {
    it('should call sendDeadlineNotification and return its result', async () => {
      const body = { userId: 1, message: 'Test message' };
      const expectedResult = 'notification sent';

      mockNotificationService.sendDeadlineNotification.mockResolvedValue(expectedResult);

      const result = await controller.sendDeadlineCardNotification(body);

      expect(service.sendDeadlineNotification).toHaveBeenCalledWith(body.userId, body.message);
      expect(result).toBe(expectedResult);
    });
  });
});
