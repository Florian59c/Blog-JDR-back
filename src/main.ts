import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Active le parsing des cookies
  app.enableCors({
    origin: 'http://localhost:3000', // URL de ton frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes autorisées
    allowedHeaders: 'Content-Type, Accept', // En-têtes autorisés
    credentials: true, // Autorise les cookies cross-origin
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Ignore les champs non définis dans le DTO
    forbidNonWhitelisted: true, // Rejette les requêtes avec des champs inconnus
    transform: true,  // Convertit les types selon le DTO
  }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();