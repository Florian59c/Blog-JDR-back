import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestApiController } from './test-api/test-api.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user', // Utilise les valeurs définies dans docker-compose.yml
      password: 'password',
      database: 'database_name',
      entities: [], // Ajoute ici tes entités
      synchronize: true, // À utiliser en développement (ne pas utiliser en production)
    }),
  ],
  controllers: [AppController, TestApiController],
  providers: [AppService],
})
export class AppModule {}
