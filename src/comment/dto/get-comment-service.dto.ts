import { IsNotEmpty } from "class-validator";

export class GetCommentsByPostDto {
    @IsNotEmpty({ message: 'Le type de post est obligatoire pour le post et ces commentaires. ' })
    postType: string;

    @IsNotEmpty({ message: 'L\'id du post est obligatoire pour afficher les commentaires le concernant.' })
    postId: number;
}