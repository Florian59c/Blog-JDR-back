import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';
import { ResponseMessage } from 'src/interfaces/response.interface';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtPayload } from 'jsonwebtoken';

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

  async updateHero(updateHeroDto: UpdateHeroDto): Promise<ResponseMessage> {
    const { id, title, link, tag } = updateHeroDto;

    try {
      const findedHero = await this.heroRepository.findOneBy({ id })

      if (!findedHero) {
        throw new NotFoundException('Histoire dont vous êtes le héros non trouvé');
      }

      findedHero.title = title;
      findedHero.link = link;
      findedHero.tag = tag;
      await this.heroRepository.save(findedHero);

      return { message: 'La modification a bien été effectué' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la modification de l\'histoire dont vous êtes le héros');
    }
  }

  async deleteHero(id: number): Promise<ResponseMessage> {
    try {
      const findedHero = await this.heroRepository.findOneBy({ id });

      if (!findedHero) {
        throw new NotFoundException('L\'histoire dont vous êtes le héros est introuvable');
      }

      await this.heroRepository.delete(findedHero.id);

      return { message: 'L\'histoire dont vous êtes le héros a bien été supprimé' };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression de l\'histoire dont vous êtes le héros');
    }
  }
}