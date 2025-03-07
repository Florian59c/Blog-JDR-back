import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail({}, { message: "L\'adresse mail doit avoir un format du type : exemple@gmail.com." })
    email: string;
}