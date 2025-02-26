import { Module } from '@nestjs/common';
import { JdrListService } from './jdr_list.service';
import { JdrListController } from './jdr_list.controller';

@Module({
  controllers: [JdrListController],
  providers: [JdrListService],
})
export class JdrListModule {}
