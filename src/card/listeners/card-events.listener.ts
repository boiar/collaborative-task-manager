import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CardUpdatedEvent } from '../events/card-updated.event';

@Injectable()
export class CardEventsListener {
  private readonly logger = new Logger(CardEventsListener.name);

  @OnEvent('card.updated')
  handleCardUpdatedEvent(event: CardUpdatedEvent) {
    if (event.success) {
      this.logger.log(
        `Card ${event.cardId} was successfully updated by user ${event.updatedBy}`,
      );

      // may be added logic notify user
      this.logger.log(
        `We send notification to user about update card ${event.cardId} was successfully`,
      );
    } else {
      this.logger.warn(
        `Failed to update card ${event.cardId} by user ${event.updatedBy}`,
      );
      // may be alert admin
      this.logger.log(
        `We send alert to admin about failure update card ${event.cardId}`,
      );
    }
  }
}
