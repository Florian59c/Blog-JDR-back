import { Controller, Post, Body } from '@nestjs/common';
import { JdrListService } from './jdr_list.service';
import { CreateJdrListDto } from './dto/create-jdr_list.dto';

@Controller('jdr-list')
export class JdrListController {
  constructor(private readonly jdrListService: JdrListService) { }

  @Post('createJdrNameInList')
  createJdrNameInList(@Body() createJdrListDto: CreateJdrListDto) {
    return this.jdrListService.createJdrNameInList(createJdrListDto);
  }
}