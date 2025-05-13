import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ListEntity } from '../list/list.entity';
import { BoardEntity } from '../board/board.entity';
import { CardEntity } from './card.entity';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ListEntity, BoardEntity, CardEntity]),
  ],
  controllers: [CardController],
  providers: [
    {
      provide: 'ICardService',
      useClass: CardService,
    },
  ],
})
export class CardModule {}
