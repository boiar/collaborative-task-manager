import { INotificationService } from './interfaces/notification-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { Repository } from 'typeorm';
import { NotificationGateway } from './notification.gateway';

export class NotificationService implements INotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async sendDeadlineNotification(userId: number, message: string) {
    const notification = this.notificationRepo.create({
      user_id: userId,
      message: message,
      is_seen: false,
      type: 'deadline',
    });
    await this.notificationRepo.save(notification);
    // Emit to WebSocket

    this.notificationGateway.sendToUser(userId, {
      id: notification.id,
      message: notification.message,
      type: notification.type,
      created_at: notification.created_at,
    });

    return 'notification sent';
  }

  async markAsSeen(notificationId: number) {
    await this.notificationRepo.update(
      { id: notificationId },
      { is_seen: true },
    );
  }
}
