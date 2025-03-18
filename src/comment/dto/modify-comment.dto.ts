import { IsNotEmpty } from "class-validator";

export class mModifyCommentDto {
    @IsNotEmpty({ message: 'L\'id du commentaire est obligatoire. ' })
    commentId: number;

    @IsNotEmpty({ message: 'Le contenu du commentaire est obligatoire.' })
    content: string
}