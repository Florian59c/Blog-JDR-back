import { Controller, Get } from '@nestjs/common';
import { LatestContentService } from './latest-content.service';

@Controller('latest-content')
export class LatestContentController {
  constructor(private readonly latestContentService: LatestContentService) { }

  @Get('get10LatestContent')
  find10LatestContent() {
    return this.latestContentService.find10LatestContent();
  }
}