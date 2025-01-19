import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  pseudo: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères' })
  password: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 carractères' })
  confirmPassword: string;
}