import { Module } from '@nestjs/common';
import { JdrListService } from './jdr_list.service';
import { JdrListController } from './jdr_list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JdrList } from './entities/jdr_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JdrList])],
  controllers: [JdrListController],
  providers: [JdrListService],
})
export class JdrListModule { }