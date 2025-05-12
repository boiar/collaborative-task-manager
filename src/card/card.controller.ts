import { CardService } from './card.service';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { User } from '../shared/decorators/user.decorator';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/multer.util';
import { UploadFile } from '../shared/decorators/upload-file.decorator';

@Controller('api/card')
export class CardController {
  private createCardDto: any;
  constructor(private readonly cardService: CardService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UploadFile('file')
  async createCard(
    @User('userId') userId: number,
    @Body() data: CreateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      data.file_path = file.path; // Set the file path to the DTO
    }

    return await this.cardService.createCard(userId, data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UploadFile('file')
  async updateCard(
    @User('userId') userId: number,
    @Param('id') cardId: number,
    @Body() data: UpdateCardDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      data.file_path = file.path; // Set the file path to the DTO
    }
    return this.cardService.updateCard(userId, cardId, data);
  }
}
