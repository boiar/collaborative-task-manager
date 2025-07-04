import { NotificationEntity } from '../notification.entity';

export interface INotificationRepositoryInterface {
  findAll(): Promise<NotificationEntity[]>;
  findById(id: number): Promise<NotificationEntity | null>;
  findOne(options: any): Promise<NotificationEntity | null>;
  findOneBy(where: any): Promise<NotificationEntity | null>;
  create(data: Partial<NotificationEntity>): Promise<NotificationEntity>;
  update(id: number, data: Partial<NotificationEntity>): Promise<NotificationEntity>;
  delete(id: number): Promise<void>;
  save(data: NotificationEntity): Promise<NotificationEntity>;
}
