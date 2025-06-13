import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateNewsDto } from './dto/update-news.dto';

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

  @Post('updateNews')
  @UseGuards(AdminGuard)
  updateNews(@Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(updateNewsDto);
  }
}