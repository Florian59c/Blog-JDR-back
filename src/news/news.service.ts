import { Injectable } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>, // Injecte le Repository TypeORM
  ) { }

  async createNews(createNewsDto: CreateNewsDto): Promise<string> {
    const { title, link, tag } = createNewsDto;
    try {
      const existTitle = await this.newsRepository.findOneBy({ title })
      if (existTitle) {
        return 'Le titre du document existe déjà';
      }
      const existLink = await this.newsRepository.findOneBy({ link })
      if (existLink) {
        return 'Le lien du document existe déjà';
      }
      const newNews = this.newsRepository.create({ title, link, tag }); // Prépare l'utilisateur
      this.newsRepository.save(newNews); // Insère dans la base
      return "ok";
    } catch (error) {
      console.error(error);
      return "Un problème est survenu lors de la création d'une nouvelle";
    }
  }

  findAllNewsWithNewDate(): Promise<News[]> {
    return this.newsRepository.find({
      order: { date: 'DESC' },
      relations: ['comments'],
    });
  }
}