import { IsNotEmpty } from "class-validator";

export class CreateJdrListDto {
    @IsNotEmpty({ message: 'Le nom du JDR ne peut pas être vide ou null.' })
    name: string;
}