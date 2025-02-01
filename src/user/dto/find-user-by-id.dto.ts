import { IsNotEmpty } from 'class-validator';

export class FindUserByIdDto {
    // @IsNotEmpty()
    id: number;
}