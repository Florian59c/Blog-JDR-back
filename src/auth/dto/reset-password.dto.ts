import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDto {
    token: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères' })
    password: string
}