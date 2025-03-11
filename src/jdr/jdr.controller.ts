import { Controller, Post, Body } from '@nestjs/common';
import { JdrService } from './jdr.service';
import { CreateJdrDto } from './dto/create-jdr.dto';

@Controller('jdr')
export class JdrController {
  constructor(private readonly jdrService: JdrService) { }

  @Post('createJdr')
  createJdr(@Body() createJdrDto: CreateJdrDto) {
    return this.jdrService.createJdr(createJdrDto);
  }
}