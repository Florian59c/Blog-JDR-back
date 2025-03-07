import { IsEmail, MinLength } from "class-validator";

export class LoginDto {
      @IsEmail({}, { message: "L\'adresse mail doit avoir un format du type : exemple@gmail.com. " })
      email: string;

      @MinLength(8, { message: 'Votre mot de passe contient au moins 8 caractères.' })
      password: string;
}