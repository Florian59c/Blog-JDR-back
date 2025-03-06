import { IsNotEmpty, IsString } from "class-validator";

export class CreateJdrListDto {
    @IsString()
    @IsNotEmpty({ message: 'Le nom du JDR ne peut pas être vide ou null' })
    name: string;
}