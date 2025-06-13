import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { Repository } from 'typeorm';
import { ResponseMessage } from 'src/interfaces/response.interface';
import { UpdateNewsDto } from './dto/update-news.dto';

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

  async updateNews(updateNewsDto: UpdateNewsDto): Promise<ResponseMessage> {
    const { id, title, link, tag } = updateNewsDto;

    try {
      const findedHero = await this.newsRepository.findOneBy({ id })

      if (!findedHero) {
        throw new NotFoundException('Nouvelle non trouvé');
      }

      findedHero.title = title;
      findedHero.link = link;
      findedHero.tag = tag;
      await this.newsRepository.save(findedHero);

      return { message: 'La modification a bien été effectué' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la modification de la nouvelle');
    }
  }
}