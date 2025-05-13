import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './notification.entity';
import { UserEntity } from '../user/user.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'INotificationService',
      useClass: NotificationService,
    },
    NotificationGateway,
  ],
})
export class NotificationModule {}
