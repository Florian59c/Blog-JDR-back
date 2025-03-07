import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty({ message: "token manquant" })
    token: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères' })
    password: string
}