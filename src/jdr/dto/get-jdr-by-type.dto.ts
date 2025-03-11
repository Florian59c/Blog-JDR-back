import { IsNotEmpty, IsNumber } from "class-validator";

export class GetJdrByTypeDto {
    @IsNotEmpty({ message: 'On doit savoir si le JDR et un scénario ou une aide de jeu. ' })
    is_scenario: boolean;
}