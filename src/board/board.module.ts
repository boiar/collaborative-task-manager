import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from './board.entity';
import { ListEntity } from '../list/list.entity';
import { BOARD_REPOSITORY } from './interfaces/board-repository.interface';
import { BoardRepository } from './repositories/board.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BoardEntity, ListEntity]),
    UserModule,
  ],
  controllers: [BoardController],
  providers: [
    {
      provide: 'IBoardService',
      useClass: BoardService,
    },
    {
      provide: BOARD_REPOSITORY,
      useClass: BoardRepository,
    },
  ],
  exports: [BOARD_REPOSITORY],
})
export class BoardModule {}
