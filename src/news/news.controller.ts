import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post('createNews')
  @UseGuards(AdminGuard)
  createNews(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews(createNewsDto);
  }

  @Get('getAllNewsWithNewDate')
  findAllNewsWithNewDate() {
    return this.newsService.findAllNewsWithNewDate();
  }
}