import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { HeroService } from './hero.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateHeroDto } from './dto/update-hero.dto';

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

  @Post('updateHero')
  @UseGuards(AdminGuard)
  updateHero(@Body() updateHeroDto: UpdateHeroDto) {
    return this.heroService.updateHero(updateHeroDto);
  }

  @Post('deleteHero')
  @UseGuards(AdminGuard)
  deleteHero(@Body('id') id: number) {
    return this.heroService.deleteHero(id);
  }
}