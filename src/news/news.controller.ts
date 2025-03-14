import { Controller, Get, Post, Body } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Post('createNews')
  createNews(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews(createNewsDto);
  }

  @Get('getAllNewsWithNewDate')
  findAllNewsWithNewDate() {
    return this.newsService.findAllNewsWithNewDate();
  }
}