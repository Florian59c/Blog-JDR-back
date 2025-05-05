import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';
import { ResponseMessage } from 'src/interfaces/response.interface';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>, // Injecte le Repository TypeORM
  ) { }

  async createHero(createHeroDto: CreateHeroDto): Promise<ResponseMessage> {
    const { title, link, tag } = createHeroDto;
    try {
      const existTitle = await this.heroRepository.findOneBy({ title })
      if (existTitle) {
        throw new BadRequestException('Le titre du document existe déjà');
      }

      const existLink = await this.heroRepository.findOneBy({ link })
      if (existLink) {
        throw new BadRequestException('Le lien du document existe déjà');
      }

      const newHero = this.heroRepository.create({ title, link, tag }); // Prépare l'utilisateur
      await this.heroRepository.save(newHero); // Insère dans la base

      return { message: 'L\'histoire dont vous êtes le héros a bien été créée' };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la création d’une histoire dont vous êtes le héros.',
      );
    }
  }

  findAllHeroWithNewDate(): Promise<Hero[]> {
    try {
      return this.heroRepository.find({
        order: { date: 'DESC' },
        relations: ['comments'], // Charge les commentaires liés aux histoires dont vous êtes le hero
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des histoires :', error);
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la récupération des histoires.',
      );
    }
  }
}