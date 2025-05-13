import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from '../board/board.entity';
import { ListEntity } from './list.entity';
import { ListService } from './list.service';
import { ListController } from './list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BoardEntity, ListEntity])],
  controllers: [ListController],
  providers: [
    {
      provide: 'IListService',
      useClass: ListService,
    },
  ],
})
export class ListModule {}
