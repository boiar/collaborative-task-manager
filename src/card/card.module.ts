import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ListEntity } from '../list/list.entity';
import { BoardEntity } from '../board/board.entity';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardEventsListener } from "./listeners/card-events.listener";
import { CARD_REPOSITORY } from "./interfaces/card-repository.interface";
import { CardRepository } from "./repositories/card.repository";
import { LIST_REPOSITORY } from "../list/interfaces/list-repository.interface";
import { ListRepository } from "../list/repositories/list.repository";
import { UserModule } from "../user/user.module";
import { User } from "../shared/decorators/user.decorator";
import { BoardModule } from "../board/board.module";
import { ListModule } from "../list/list.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListEntity, BoardEntity, CardEntity]),
    UserModule,
    BoardModule,
    ListModule,
  ],
  controllers: [CardController],
  providers: [
    {
      provide: 'ICardService',
      useClass: CardService,
    },
    CardEventsListener,
    {
      provide: CARD_REPOSITORY,
      useClass: CardRepository,
    },
    {
      provide: LIST_REPOSITORY,
      useClass: ListRepository,
    },
  ],
  exports: [LIST_REPOSITORY],
})
export class CardModule {}
