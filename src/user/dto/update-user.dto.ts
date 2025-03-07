import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: 'Le pseudo est obligatoire' })
    pseudo: string;

    @IsEmail()
    email: string;
}