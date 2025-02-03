import { IsEmail } from "class-validator";

export class UpdateUserDto {
    pseudo: string;

    @IsEmail()
    email: string;
}