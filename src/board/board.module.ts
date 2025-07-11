import { forwardRef, Module } from "@nestjs/common";
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from './board.entity';
import { ListEntity } from '../list/list.entity';
import { UserModule } from '../user/user.module';
import { BOARD_REPOSITORY } from './interfaces/board.repository.interface';
import { BoardRepository } from './board.repository';
import { BoardService } from './board.service';
import { ListModule } from '../list/list.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BoardEntity, ListEntity]),
    forwardRef(() => UserModule),
    forwardRef(() => ListModule),
  ],
  controllers: [BoardController],
  providers: [
    {
      provide: BOARD_REPOSITORY,
      useClass: BoardRepository,
    },
    {
      provide: 'IBoardService',
      useClass: BoardService,
    },
  ],
  exports: [BOARD_REPOSITORY],
})
export class BoardModule {}
