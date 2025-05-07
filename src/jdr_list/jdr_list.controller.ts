import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { JdrListService } from './jdr_list.service';
import { CreateJdrListDto } from './dto/create-jdr_list.dto';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('jdr-list')
export class JdrListController {
  constructor(private readonly jdrListService: JdrListService) { }

  @Post('createJdrNameInList')
  @UseGuards(AdminGuard)
  createJdrNameInList(@Body() createJdrListDto: CreateJdrListDto) {
    return this.jdrListService.createJdrNameInList(createJdrListDto);
  }

  @Get('getAllJdrNames')
  findAllJdrNames() {
    return this.jdrListService.findAllJdrNamesByAlphabeticalOrder();
  }
}