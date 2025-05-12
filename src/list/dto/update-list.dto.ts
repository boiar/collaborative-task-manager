import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';

export class UpdateListDto extends PartialType(
  PickType(CreateListDto, ['title', 'position']),
) {}
