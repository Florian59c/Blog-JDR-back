import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { ResponseMessage } from 'src/interfaces/response.interface';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>, // Injecte le Repository TypeORM
  ) { }

  async createNews(createNewsDto: CreateNewsDto): Promise<ResponseMessage> {
    const { title, link, tag } = createNewsDto;

    try {
      const existTitle = await this.newsRepository.findOneBy({ title })
      if (existTitle) {
        throw new BadRequestException('Le titre du document existe déjà');
      }

      const existLink = await this.newsRepository.findOneBy({ link })
      if (existLink) {
        throw new BadRequestException('Le lien du document existe déjà');
      }

      const newNews = this.newsRepository.create({ title, link, tag }); // Prépare l'utilisateur
      await this.newsRepository.save(newNews); // Insère dans la base

      return { message: 'La nouvelle a bien été créée' };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la création de la nouvelle'
      );
    }
  }

  async findAllNewsWithNewDate(): Promise<News[]> {
    try {
      return await this.newsRepository.find({
        order: { date: 'DESC' },
        relations: ['comments'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la récupération des nouvelles.'
      );
    }
  }
}