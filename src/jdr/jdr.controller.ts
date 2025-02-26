import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JdrService } from './jdr.service';
import { CreateJdrDto } from './dto/create-jdr.dto';
import { UpdateJdrDto } from './dto/update-jdr.dto';

@Controller('jdr')
export class JdrController {
  constructor(private readonly jdrService: JdrService) {}

  @Post()
  create(@Body() createJdrDto: CreateJdrDto) {
    return this.jdrService.create(createJdrDto);
  }

  @Get()
  findAll() {
    return this.jdrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jdrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJdrDto: UpdateJdrDto) {
    return this.jdrService.update(+id, updateJdrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jdrService.remove(+id);
  }
}
