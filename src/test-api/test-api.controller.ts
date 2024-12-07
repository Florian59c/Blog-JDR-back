import { Controller, Get } from '@nestjs/common';

@Controller('testApi')
export class TestApiController {
  @Get('message')
  getMessage() {
    return { message: 'Salut depuis le backend NestJS!' };
  }
}
