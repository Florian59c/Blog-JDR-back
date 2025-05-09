import { IsNotEmpty, IsString } from "class-validator";

export class CreateHeroDto {
    @IsNotEmpty({ message: 'Le titre est obligatoire. ' })
    title: string;

    @IsNotEmpty({ message: 'Le lien est obligatoire. ' })
    link: string;

    @IsString({ message: 'Le tag doit être une chaîne de caractères.' })
    tag: string;
}