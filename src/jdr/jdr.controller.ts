import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JdrService } from './jdr.service';
import { CreateJdrDto } from './dto/create-jdr.dto';
import { GetsortedJdrDto } from './dto/get-sorted-jdr.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UpdateJdrDto } from './dto/update-jdr.dto';

@Controller('jdr')
export class JdrController {
  constructor(private readonly jdrService: JdrService) { }

  @Post('createJdr')
  @UseGuards(AdminGuard)
  createJdr(@Body() createJdrDto: CreateJdrDto) {
    return this.jdrService.createJdr(createJdrDto);
  }

  @Post('getsortedJdr')
  getsortedJdr(@Body() getsortedJdrDto: GetsortedJdrDto) {
    return this.jdrService.getsortedJdr(getsortedJdrDto);
  }

  @Get('findAllJdrWithNewDate')
  findAllJdrWithNewDate() {
    return this.jdrService.findAllJdrWithNewDate();
  }

  @Post('updateJdr')
  @UseGuards(AdminGuard)
  updateJdr(@Body() updateJdrDto: UpdateJdrDto) {
    return this.jdrService.updateJdr(updateJdrDto);
  }
}