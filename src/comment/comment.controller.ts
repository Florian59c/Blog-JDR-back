import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsByPostDto } from './dto/get-comment-service.dto';
import { ReportCommentDto } from './dto/report-comment.dto';
import { ModifyCommentDto } from './dto/modify-comment.dto';
import { AdminGuard } from 'src/guards/admin.guard';

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

  @Get('getReportedComments')
  @UseGuards(AdminGuard)
  getReportedComments() {
    return this.commentService.getReportedComments();
  }

  @Post('cancelReportForComment')
  @UseGuards(AdminGuard)
  cancelReportForComment(@Body('id') id: number) {
    return this.commentService.cancelReportForComment(id);
  }

  @Post('getCurrentUserComments')
  getCurrentUserComments(@Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.commentService.getCurrentUserComments(token);
  }

  @Post('modifyCommentByUser')
  modifyCommentByUser(@Body() modifyCommentDto: ModifyCommentDto, @Req() req: Request) {
    const token = req.cookies['auth-token'];
    return this.commentService.modifyCommentByUser(modifyCommentDto, token);
  }

  @Post('deleteCommentByUser')
  deleteCommentByUser(@Req() req: Request, @Body('id') id: number) {
    const token = req.cookies['auth-token'];
    return this.commentService.deleteCommentByUser(token, id);
  }

  @Post('deleteCommentByAdmin')
  @UseGuards(AdminGuard)
  deleteCommentByAdmin(@Body('id') id: number) {
    return this.commentService.deleteCommentByAdmin(id);
  }
}