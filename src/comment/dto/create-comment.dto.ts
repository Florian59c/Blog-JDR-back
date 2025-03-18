import { IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty({ message: 'Vous ne pouvez pas poster un commentaire vide. ' })
    content: string;

    @IsNotEmpty({ message: 'Le type de post est obligatoire pour savoir sur quelle table va etre lié le commentaire. ' })
    postType: string;

    @IsNotEmpty({ message: 'L\'id du post que le commentaire concerne est obligatoire.' })
    postId: number;
}