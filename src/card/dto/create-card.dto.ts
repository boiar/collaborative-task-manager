import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from "class-transformer";

export class CreateCardDto {
  @IsString({ message: 'validation.card.titleMustBeString' })
  @IsNotEmpty({ message: 'validation.card.titleRequired' })
  title: string;

  @IsOptional()
  description: string;

  @IsDate({ message: 'validation.card.dueDateIsDate' })
  @IsNotEmpty({ message: 'validation.card.dueDateRequired' })
  @Type(() => Date)
  due_date: Date;

  @IsNotEmpty({ message: 'validation.card.positionRequired' })
  position: number;

  @IsNotEmpty({ message: 'validation.card.listIdRequired' })
  list_id: number;

  @IsOptional()
  file_path?: string;
}
