import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserDto {
    @IsNotEmpty({ message: 'Le pseudo est obligatoire. ' })
    pseudo: string;

    @IsEmail({}, { message: "L\'adresse mail doit avoir un format du type : exemple@gmail.com." })
    email: string;
}