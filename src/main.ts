import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // URL de ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes autorisées
    allowedHeaders: 'Content-Type, Accept', // En-têtes autorisés
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
