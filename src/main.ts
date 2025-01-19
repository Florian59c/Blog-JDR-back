import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

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

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();