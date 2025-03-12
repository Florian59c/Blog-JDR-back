import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('createComment')
  createComment(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.commentService.createComment(createCommentDto, token);
  }
}