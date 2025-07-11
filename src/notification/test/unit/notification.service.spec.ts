import { NotificationService } from '../../notification.service';
import { NotificationGateway } from '../../notification.gateway';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../notification.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepo: jest.Mocked<Repository<NotificationEntity>>;
  let notificationGateway: jest.Mocked<NotificationGateway>;

  beforeEach(() => {
    // Mock TypeORM Repository methods we use
    notificationRepo = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      // add other Repository methods as needed with jest.fn()
    } as any;

    // Mock NotificationGateway method
    notificationGateway = {
      sendToUser: jest.fn(),
    } as any;

    // Create service instance with mocks
    service = new NotificationService(notificationRepo, notificationGateway);
  });

  describe('sendDeadlineNotification', () => {
    it('should create, save a notification and send it via gateway', async () => {
      const userId = 1;
      const message = 'Test deadline message';

      // Mock create to return a NotificationEntity with id and created_at
      const fakeNotification = {
        id: 123,
        user_id: userId,
        message,
        is_seen: false,
        type: 'deadline',
        created_at: new Date(),
      } as NotificationEntity;

      notificationRepo.create.mockReturnValue(fakeNotification);
      notificationRepo.save.mockResolvedValue(fakeNotification);

      const result = await service.sendDeadlineNotification(userId, message);

      expect(notificationRepo.create).toHaveBeenCalledWith({
        user_id: userId,
        message,
        is_seen: false,
        type: 'deadline',
      });

      expect(notificationRepo.save).toHaveBeenCalledWith(fakeNotification);

      expect(notificationGateway.sendToUser).toHaveBeenCalledWith(userId, {
        id: fakeNotification.id,
        message: fakeNotification.message,
        type: fakeNotification.type,
        created_at: fakeNotification.created_at,
      });

      expect(result).toBe('notification sent');
    });
  });

  describe('markAsSeen', () => {
    it('should update notification is_seen to true', async () => {
      const notificationId = 123;

      notificationRepo.update.mockResolvedValue({} as any); // can be empty or result of update

      await service.markAsSeen(notificationId);

      expect(notificationRepo.update).toHaveBeenCalledWith(
        { id: notificationId },
        { is_seen: true },
      );
    });
  });
});
