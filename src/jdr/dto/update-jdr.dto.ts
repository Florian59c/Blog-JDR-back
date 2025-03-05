import { PartialType } from '@nestjs/mapped-types';
import { CreateJdrDto } from './create-jdr.dto';

export class UpdateJdrDto extends PartialType(CreateJdrDto) {}
