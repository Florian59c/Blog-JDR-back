import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le pseudo est obligatoire. ' })
  pseudo: string;

  @IsEmail({}, { message: "L\'adresse mail doit avoir un format du type : exemple@gmail.com. " })
  email: string;

  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères. ' })
  password: string;

  @IsString()
  confirmPassword: string;

  @IsBoolean()
  checkCGU: boolean;
}