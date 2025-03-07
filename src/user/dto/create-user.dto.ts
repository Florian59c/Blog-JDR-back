import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Le pseudo est obligatoire' })
  pseudo: string;

  @IsEmail()
  @IsNotEmpty({ message: 'L\'Email est obligatoire' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères' })
  password: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'L\'approbation des conditions générales d\'utilisation est obligatoire' })
  checkCGU: boolean;
}