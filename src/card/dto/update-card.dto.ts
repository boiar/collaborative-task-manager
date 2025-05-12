import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateCardDto } from './create-card.dto';
import { CreateListDto } from "../../list/dto/create-list.dto";

export class UpdateCardDto extends PartialType(
  PickType(CreateCardDto, [
    'title',
    'position',
    'description',
    'due_date',
    'file_path',
  ]),
) {}
