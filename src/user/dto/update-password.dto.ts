import { IsNotEmpty, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty({ message: "ID manquant" })
    id: number;

    @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
    @MinLength(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    password: string;
}