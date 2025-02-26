import { PartialType } from '@nestjs/mapped-types';
import { CreateJdrListDto } from './create-jdr_list.dto';

export class UpdateJdrListDto extends PartialType(CreateJdrListDto) {}
