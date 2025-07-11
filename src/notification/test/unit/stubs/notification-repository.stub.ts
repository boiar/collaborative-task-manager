import { NotificationEntity } from '../../../notification.entity';
import { UserEntity } from '../../../../user/user.entity';

const mockUser: UserEntity = {
  user_id: 1,
  email: 'test@example.com',
  name: 'Mock User',
  password: '',
  boards: [],
  notifications: [],
};

// Internal mock store for notifications
let mockNotifications: NotificationEntity[] = [];

function createNotificationEntity(
  data: Partial<NotificationEntity>,
): NotificationEntity {
  const entity = new NotificationEntity();
  entity.id = data.id ?? mockNotifications.length + 1;
  entity.user_id = data.user_id!;
  entity.message = data.message!;
  entity.is_seen = data.is_seen ?? false;
  entity.created_at = data.created_at ?? new Date();

  (entity as any).toResponseObject = function () {
    return {
      id: this.id,
      user_id: this.user_id,
      message: this.message,
      is_seen: this.is_seen,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  };

  return entity;
}

export class NotificationRepositoryStub {
  constructor() {
    if (mockNotifications.length === 0) {
      mockNotifications.push(
        createNotificationEntity({
          type: '',
          user: undefined,
          created_at: undefined,
          is_seen: false,
          id: 1,
          user_id: mockUser.user_id,
          message: 'Stubbed Notification',
        }),
      );
    }
  }

  async findAllByUserId(user_id: number): Promise<NotificationEntity[]> {
    return mockNotifications.filter((n) => n.user_id === user_id);
  }

  async findByIdAndUserId(
    id: number,
    user_id: number,
  ): Promise<NotificationEntity | null> {
    return (
      mockNotifications.find((n) => n.id === id && n.user_id === user_id) ??
      null
    );
  }

  async create(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const newNotification = createNotificationEntity(data);
    mockNotifications.push(newNotification);
    return newNotification;
  }

  async save(entity: NotificationEntity): Promise<NotificationEntity> {
    const index = mockNotifications.findIndex((n) => n.id === entity.id);
    if (index !== -1) {
      mockNotifications[index] = entity;
    } else {
      mockNotifications.push(entity);
    }
    return entity;
  }

  async update(
    id: number,
    data: Partial<NotificationEntity>,
  ): Promise<NotificationEntity> {
    const existing = await this.findByIdAndUserId(id, data.user_id!);
    if (!existing) throw new Error('Notification not found');

    const updated = createNotificationEntity({
      ...existing,
      ...data,
    });

    await this.save(updated);
    return updated;
  }

  async delete(id: number, user_id: number): Promise<boolean> {
    const initialLength = mockNotifications.length;
    mockNotifications = mockNotifications.filter(
      (n) => !(n.id === id && n.user_id === user_id),
    );
    return mockNotifications.length < initialLength;
  }
}
