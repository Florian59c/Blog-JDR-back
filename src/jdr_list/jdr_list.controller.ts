import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JdrListService } from './jdr_list.service';
import { CreateJdrListDto } from './dto/create-jdr_list.dto';
import { UpdateJdrListDto } from './dto/update-jdr_list.dto';

@Controller('jdr-list')
export class JdrListController {
  constructor(private readonly jdrListService: JdrListService) {}

  @Post()
  create(@Body() createJdrListDto: CreateJdrListDto) {
    return this.jdrListService.create(createJdrListDto);
  }

  @Get()
  findAll() {
    return this.jdrListService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jdrListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJdrListDto: UpdateJdrListDto) {
    return this.jdrListService.update(+id, updateJdrListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jdrListService.remove(+id);
  }
}
