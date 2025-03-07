import { IsEmail, IsNotEmpty } from "class-validator";

export class SendMailDto {
    @IsEmail({}, { message: "L\'adresse mail doit avoir un format du type : exemple@gmail.com. " })
    from: string;

    @IsNotEmpty({ message: 'L\'objet est obligatoire. ' })
    subject: string;

    @IsNotEmpty({ message: 'Le contenu du mail est obligatoire.' })
    content: string;
}