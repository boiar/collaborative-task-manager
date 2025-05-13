import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CardEntity } from './card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from '../notification/notification.service';
import { I18nService } from 'nestjs-i18n';
import { BoardEntity } from '../board/board.entity';
import * as moment from 'moment-timezone';

@Injectable()
export class CardDeadlineScheduler {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepo: Repository<CardEntity>,
    @InjectRepository(BoardEntity)
    private boardRepo: Repository<BoardEntity>,
    private notificationService: NotificationService,
    private readonly i18n: I18nService,
  ) {}

  // This will run at midnight every day
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCardDeadlineNotifications() {
    const tomorrow = moment().tz('Your/Timezone').add(1, 'days').startOf('day'); // Set to tomorrow's date and timezone
    const tomorrowDate = tomorrow.toDate(); // Get the Date object

    // Query cards with due date matching tomorrow's date
    const cards = await this.cardRepo.find({
      where: {
        due_date: tomorrowDate, // Ensure no time component is added
      },
      relations: ['list', 'list.board', 'list.board.owner'],
    });

    // Iterate through the found cards
    for (const card of cards) {
      const userId = card.list.board.owner.user_id;
      const message = `The card "${card.title}" is due tomorrow.`;

      // Send notification to the user
      await this.notificationService.sendDeadlineNotification(userId, message);
    }
  }
}
