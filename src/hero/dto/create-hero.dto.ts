import { IsNotEmpty, IsString } from "class-validator";

export class CreateHeroDto {
    @IsString()
    @IsNotEmpty({ message: 'Le titre ne peut pas être vide ou null' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'Le lien ne peut pas être vide ou null' })
    link: string;

    @IsString()
    tag: string;
}