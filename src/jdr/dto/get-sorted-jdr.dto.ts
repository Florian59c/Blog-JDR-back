import { IsNotEmpty } from "class-validator";

export class GetsortedJdrDto {
    @IsNotEmpty({ message: 'On doit savoir si le JDR et un scénario ou une aide de jeu. ' })
    is_scenario: boolean;

    @IsNotEmpty({ message: 'On doit savoir le nom du jdr sélectionné pour pouvoir faire le tri. ' })
    jdrName: string;
}