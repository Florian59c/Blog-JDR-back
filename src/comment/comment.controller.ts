import { Controller, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsByPostDto } from './dto/get-comment-service.dto';
import { ReportCommentDto } from './dto/report-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('createComment')
  createComment(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.commentService.createComment(createCommentDto, token);
  }

  @Post('getCommentsByPost')
  getCommentsByPost(@Body() getCommentsByPostDto: GetCommentsByPostDto) {
    return this.commentService.getCommentsByPost(getCommentsByPostDto);
  }

  @Post('reportComment')
  reportComment(@Body() reportCommentDto: ReportCommentDto, @Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.commentService.reportComment(reportCommentDto, token);
  }
}