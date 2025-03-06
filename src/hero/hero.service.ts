import { Injectable } from '@nestjs/common';
import { CreateHeroDto } from './dto/create-hero.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Hero } from './entities/hero.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeroService {
  constructor(
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>, // Injecte le Repository TypeORM
  ) { }

  async createHero(createHeroDto: CreateHeroDto): Promise<string> {
    const { title, link, tag } = createHeroDto;
    try {
      const existTitle = await this.heroRepository.findOneBy({ title })
      if (existTitle) {
        return 'Le titre du document existe déjà';
      }
      const existLink = await this.heroRepository.findOneBy({ link })
      if (existLink) {
        return 'Le lien du document existe déjà';
      }
      const newHero = this.heroRepository.create({ title, link, tag }); // Prépare l'utilisateur
      this.heroRepository.save(newHero); // Insère dans la base
      return "ok";
    } catch (error) {
      console.error(error);
      return "Un problème est survenu lors de la création d'une histoire dont vous êtes le héro";
    }
  }
}