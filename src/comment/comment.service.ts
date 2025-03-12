import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { Hero } from 'src/hero/entities/hero.entity';
import { News } from 'src/news/entities/news.entity';
import { Jdr } from 'src/jdr/entities/jdr.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Hero)
    private readonly heroRepository: Repository<Hero>,
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    @InjectRepository(Jdr)
    private readonly jdrRepository: Repository<Jdr>,
  ) { }

  async createComment(createCommentDto: CreateCommentDto, token: string): Promise<string> {
    const { content, postType, postId } = createCommentDto;
    try {
      if (!token) {
        return "Vous devez être connecté pour ajouter un commentaire";
      }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userRepository.findOneBy({ id: decoded.sub });

      if (!user) {
        return "Utilisateur introuvable, veuillez vous reconnecter.";
      }
      if (postType !== "hero" && postType !== "jdr" && postType !== "news") {
        return "Nous n'avons pas réussi à trouver le post sur lequel vous essayez d'ajouter un commentaire";
      }
      const repositories = {
        hero: this.heroRepository,
        news: this.newsRepository,
        jdr: this.jdrRepository
      };
      const entity = await repositories[postType].findOneBy({ id: postId });

      if (!entity) {
        return "Nous n'avons pas réussi à trouver le type de post sur lequel vous essayez d'ajouter un commentaire";
      }
      const newComment = this.commentRepository.create({
        content,
        user,
        [postType]: entity
      });
      await this.commentRepository.save(newComment);
      return "ok";
    } catch (error) {
      console.error(error);
      return "Un problème est survenu lors de la création du commentaire";
    }
  }
}