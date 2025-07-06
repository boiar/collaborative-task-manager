import { CardService } from './card.service';
import {
  Body,
  Controller,
  Inject,
  LoggerService,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { User } from '../shared/decorators/user.decorator';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { UploadFile } from '../shared/decorators/upload-file.decorator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ICardService } from './interfaces/card-service-interface';

@Controller('api/card')
export class CardController {
  private createCardDto: any;
  constructor(
    @Inject('ICardService') private readonly cardService: ICardService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

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
      data.file_path = file.path;
    }

    this.logger.log(`User ${userId} is updating card ${cardId}`, {
      user: userId,
      card: cardId,
      changes: data,
      action: 'update-card',
    });

    return this.cardService.updateCard(userId, cardId, data);
  }
}
