import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty({ message: "Nous n'avons pas réussi à trouver votre profil. " })
    token: string;

    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères.' })
    password: string
}