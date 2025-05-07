import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) { }

  @Post('createHero')
  @UseGuards(AdminGuard)
  createHero(@Body() createHeroDto: CreateHeroDto) {
    return this.heroService.createHero(createHeroDto);
  }

  @Get('getAllHeroWithNewDate')
  findAllHeroWithNewDate() {
    return this.heroService.findAllHeroWithNewDate();
  }
}