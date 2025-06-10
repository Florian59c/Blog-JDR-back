import { IsNotEmpty } from "class-validator";

export class FindUserByPseudoDto {
    @IsNotEmpty({ message: "Le pseudo est obligatoire" })
    pseudo: string;
}