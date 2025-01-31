import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Votre adresse mail est obligatoire' })
    email: string;
}