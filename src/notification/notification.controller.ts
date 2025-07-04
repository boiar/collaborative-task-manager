import { Body, Controller, Inject, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('api/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendDeadlineCardNotification(
    @Body() body: { userId: number; message: string },
  ) {
    return await this.notificationService.sendDeadlineNotification(
      body.userId,
      body.message,
    );
  }
}
