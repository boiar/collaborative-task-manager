import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from './board.entity';
import { ListEntity } from '../list/list.entity';
import { UserModule } from '../user/user.module';
import { BOARD_REPOSITORY } from './interfaces/board.repository.interface';
import { BoardRepository } from './board.repository';
import { USER_REPOSITORY } from '../user/interfaces/user-repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BoardEntity, ListEntity]),
    UserModule,
  ],
  controllers: [BoardController],
  providers: [
    {
      provide: BOARD_REPOSITORY,
      useClass: BoardRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class BoardModule {}
