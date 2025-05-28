import { Module } from '@nestjs/common';
import { LatestContentService } from './latest-content.service';
import { LatestContentController } from './latest-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])], // pour accéder à d'autres entités plus tard, au cas où
  controllers: [LatestContentController],
  providers: [LatestContentService],
})
export class LatestContentModule { }