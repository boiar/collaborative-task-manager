import { BoardService } from './board.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { CreateBoardDto } from './dto/create-board.dto';
import { User } from '../shared/decorators/user.decorator';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('api/board')
export class BoardController {
  constructor(
    @Inject('IBoardService') private readonly boardService: BoardService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserBoards(@User('userId') userId: number) {
    return await this.boardService.getUserBoards(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createUserBoard(
    @User('userId') userId: number,
    @Body() dto: CreateBoardDto,
  ) {
    return this.boardService.createUserBoard(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUserBoard(
    @Param('id') boardId: number,
    @User('userId') userId: number,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardService.updateUserBoard(boardId, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/lists')
  async getBoardList(
    @Param('id') boardId: number,
    @User('userId') userId: number,
  ) {
    return this.boardService.getListsOfBoard(userId, boardId);
  }

  /*TODO AFTER END LIST, CARD Modules */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUserBoard(
    @Param('id') boardId: string,
    @User('userId') userId: number,
  ) {
    /*return this.boardService.destroyUserBoard(userId);*/
  }
}
