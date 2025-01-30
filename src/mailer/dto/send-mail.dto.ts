import { IsEmail, IsNotEmpty } from "class-validator";

export class SendMailDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Votre adresse mail est obligatoire' })
    from: string;

    @IsNotEmpty({ message: 'L\'objet est obligatoire' })
    subject: string;

    @IsNotEmpty({ message: 'Le contenu est obligatoire' })
    content: string;
}