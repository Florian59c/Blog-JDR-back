import { Controller, Post, Body, Req, Get, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsByPostDto } from './dto/get-comment-service.dto';
import { ReportCommentDto } from './dto/report-comment.dto';
import { ModifyCommentDto } from './dto/modify-comment.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post('createComment')
  @UseGuards(JwtAuthGuard)
  createComment(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.createComment(createCommentDto, req['user']);
  }

  @Post('getCommentsByPost')
  getCommentsByPost(@Body() getCommentsByPostDto: GetCommentsByPostDto) {
    return this.commentService.getCommentsByPost(getCommentsByPostDto);
  }

  @Post('reportComment')
  @UseGuards(JwtAuthGuard)
  reportComment(@Body() reportCommentDto: ReportCommentDto, @Req() req: Request) {
    return this.commentService.reportComment(reportCommentDto, req['user']);
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
  @UseGuards(JwtAuthGuard)
  getCurrentUserComments(@Req() req: Request) {
    return this.commentService.getCurrentUserComments(req['user']);
  }

  @Post('modifyCommentByUser')
  @UseGuards(JwtAuthGuard)
  modifyCommentByUser(@Body() modifyCommentDto: ModifyCommentDto, @Req() req: Request) {
    return this.commentService.modifyCommentByUser(modifyCommentDto, req['user']);
  }

  @Post('deleteCommentByUser')
  @UseGuards(JwtAuthGuard)
  deleteCommentByUser(@Req() req: Request, @Body('id') id: number) {
    return this.commentService.deleteCommentByUser(req['user'], id);
  }

  @Post('deleteCommentByAdmin')
  @UseGuards(AdminGuard)
  deleteCommentByAdmin(@Body('id') id: number) {
    return this.commentService.deleteCommentByAdmin(id);
  }
}