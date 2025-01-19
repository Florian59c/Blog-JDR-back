import { IsEmail } from 'class-validator';

export class GetEmailDto {
  @IsEmail()
  email: string;
}