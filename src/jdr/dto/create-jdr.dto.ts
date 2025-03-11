import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateJdrDto {
    @IsNotEmpty({ message: 'Le titre est obligatoire. ' })
    title: string;

    @IsNotEmpty({ message: 'Le lien est obligatoire. ' })
    link: string;

    @IsNotEmpty({ message: 'On doit savoir si le JDR et un scénario ou une aide de jeu. ' })
    is_scenario: boolean;

    @IsNotEmpty({ message: 'L\'identifiant de la liste de JDR est obligatoire.' })
    @IsNumber()
    jdr_list_id: number;
}