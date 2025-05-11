import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from './board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BoardEntity])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
