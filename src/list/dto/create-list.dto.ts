import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateListDto {
  @IsNotEmpty({ message: 'validation.list.titleRequired' })
  title: string;

  @IsNotEmpty({ message: 'validation.list.positionRequired' })
  @IsNumber({}, { message: 'validation.list.positionIsNumber' })
  position: number;

  @IsNotEmpty({ message: 'validation.list.boardIdRequired' })
  boardId: number;
}
