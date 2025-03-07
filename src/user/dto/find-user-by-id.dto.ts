import { IsNotEmpty } from "class-validator";

export class FindUserByIdDto {
    @IsNotEmpty({ message: "ID manquant" })
    id: number;
}