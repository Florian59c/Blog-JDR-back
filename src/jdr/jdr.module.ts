import { Module } from '@nestjs/common';
import { JdrService } from './jdr.service';
import { JdrController } from './jdr.controller';

@Module({
  controllers: [JdrController],
  providers: [JdrService],
})
export class JdrModule {}
