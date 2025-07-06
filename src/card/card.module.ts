import { LoggerService, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ListEntity } from '../list/list.entity';
import { BoardEntity } from '../board/board.entity';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { CardEventsListener } from './listeners/card-events.listener';
import { CARD_REPOSITORY } from './interfaces/card-repository.interface';
import { CardRepository } from './repositories/card.repository';
import { LIST_REPOSITORY } from '../list/interfaces/list-repository.interface';
import { ListRepository } from '../list/repositories/list.repository';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { ListModule } from '../list/list.module';
import { BOARD_REPOSITORY } from '../board/interfaces/board.repository.interface';
import { BoardRepository } from '../board/board.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { USER_REPOSITORY } from '../user/interfaces/user-repository.interface';
import { LoggerModule } from "../shared/logger/logger.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListEntity, BoardEntity, CardEntity]),
    UserModule,
    BoardModule,
    ListModule,
    LoggerModule,
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
    {
      provide: BOARD_REPOSITORY,
      useClass: BoardRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: ['ICardService'],
})
export class CardModule {}
