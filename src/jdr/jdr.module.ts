import { Module } from '@nestjs/common';
import { JdrService } from './jdr.service';
import { JdrController } from './jdr.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Jdr } from './entities/jdr.entity';
import { JdrList } from 'src/jdr_list/entities/jdr_list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jdr, JdrList])],
  controllers: [JdrController],
  providers: [JdrService],
})
export class JdrModule { }