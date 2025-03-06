import { Controller, Post, Body, Get } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) { }

  @Post('createHero')
  createHero(@Body() createHeroDto: CreateHeroDto) {
    return this.heroService.createHero(createHeroDto);
  }

  @Get('getAllHero')
  findAllHero() {
    return this.heroService.findAllHero();
  }
}