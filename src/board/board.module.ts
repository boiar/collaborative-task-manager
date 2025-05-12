import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from './board.entity';
import { ListEntity } from '../list/list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BoardEntity, ListEntity])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
