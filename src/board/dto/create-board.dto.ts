import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString({
    message: 'validation.board.nameMustBeString',
  })
  @IsNotEmpty({
    message: 'validation.board.nameRequired',
  })
  title: string;
}