import { IsNotEmpty } from "class-validator";

export class ReportCommentDto {
    @IsNotEmpty({ message: 'L\'id du commentaire est obligatoire' })
    commentId: number;
}