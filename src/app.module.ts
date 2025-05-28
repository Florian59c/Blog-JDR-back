import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';
import { CommentModule } from './comment/comment.module';
import { JdrListModule } from './jdr_list/jdr_list.module';
import { JdrModule } from './jdr/jdr.module';
import { HeroModule } from './hero/hero.module';
import { NewsModule } from './news/news.module';
import { LatestContentModule } from './latest-content/latest-content.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Type de base de données
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Synchronisation automatique (désactivez en production)
    }),
    UserModule,
    AuthModule,
    MailerModule,
    CommentModule,
    NewsModule,
    HeroModule,
    JdrModule,
    JdrListModule,
    LatestContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }