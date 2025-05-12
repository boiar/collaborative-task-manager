import { ListService } from './list.service';
import { Body, Controller, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { User } from '../shared/decorators/user.decorator';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from "./dto/update-list.dto";

@Controller('api/list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createList(@User('userId') userId: number, @Body() dto: CreateListDto) {
    return this.listService.createList(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateList(@User('userId') userId: number, @Param('id') listId: number, @Body() dto: UpdateListDto) {
    return this.listService.updateList(userId, listId, dto)
  }
}
