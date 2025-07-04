export interface INotificationService {
  sendDeadlineNotification(userId: number, message: string);

  markAsSeen(notificationId: number);
}
