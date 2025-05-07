import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import { Hero } from 'src/hero/entities/hero.entity';
import { News } from 'src/news/entities/news.entity';
import { Jdr } from 'src/jdr/entities/jdr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Hero, News, Jdr])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule { }