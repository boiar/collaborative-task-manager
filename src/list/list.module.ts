import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { BoardEntity } from '../board/board.entity';
import { ListEntity } from './list.entity';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ListRepository } from './repositories/list.repository';
import { LIST_REPOSITORY } from './interfaces/list-repository.interface';
import { UserModule } from "../user/user.module";
import { BoardModule } from "../board/board.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, BoardEntity, ListEntity]), UserModule, BoardModule],
  controllers: [ListController],
  providers: [
    {
      provide: 'IListService',
      useClass: ListService,
    },
    {
      provide: LIST_REPOSITORY,
      useClass: ListRepository,
    },
  ],
  exports: [LIST_REPOSITORY],
})
export class ListModule {}
