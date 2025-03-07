import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
    @IsEmail({}, { message: "Votre Email doit avoir un format du type : exemple@gmail.com." })
    email: string;
}