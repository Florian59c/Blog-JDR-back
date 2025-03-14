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
import { GetCommentsByPostDto } from './dto/get-comment-service.dto';
import { ReportCommentDto } from './dto/report-comment.dto';

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

  // Affiche les commentaires liés à un post (selon le type : hero, jdr, news) avec le pseudo de l'utilisateur ayant ecrit le commentaire
  async getCommentsByPost(getCommentsByPostDto: GetCommentsByPostDto): Promise<Comment[]> {
    const { postType, postId } = getCommentsByPostDto;
    const postTypeMapping: Record<string, string> = {
      hero: "comment.hero",
      jdr: "comment.jdr",
      news: "comment.news",
    };
    const relationColumn = postTypeMapping[postType];
    if (!relationColumn) {
      throw new Error("Le type de post est invalide");
    }

    return this.commentRepository
      .createQueryBuilder("comment")
      .leftJoin("comment.user", "user")
      .leftJoin(`${relationColumn}`, "post") // Jointure dynamique sur la relation
      .select([
        "comment.id",
        "comment.content",
        "comment.creation_date",
        "user.pseudo", // Sélectionne uniquement le pseudo
      ])
      .where("post.id = :postId", { postId }) // Filtre sur l'ID du post
      .orderBy("comment.creation_date", "DESC")
      .getMany();
  }

  async reportComment(reportCommentDto: ReportCommentDto, token: string): Promise<string> {
    const { commentId } = reportCommentDto;
    if (!token) {
      return "Seuls les utilisateurs connectés peuvent signaler un commentaire";
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userRepository.findOneBy({ id: decoded.sub });
      const reportedComment = await this.commentRepository.findOneBy({ id: commentId });
      if (!user || !reportedComment) {
        return "Utilisateur ou commentaire introuvable";
      }
      reportedComment.is_report = true;
      await this.commentRepository.save(reportedComment);
      return "Le commentaire a bien été signalé !";
    } catch (error) {
      console.error(error);
      return "Une erreur est survenue lors du signalement du commentaire";
    }
  }

  async getCurrentUserComments(token: string): Promise<Comment[]> {
    if (!token) {
      throw new Error("Seuls les utilisateurs connectés peuvent voir leurs commentaires");
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
      if (!currentUser) {
        throw new Error("Utilisateur introuvable");
      }
      const findedComments = await this.commentRepository.find({
        where: { user: { id: currentUser.id } },
        order: {
          creation_date: 'DESC'
        },
      });
      return findedComments;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Votre session a expiré. Veuillez vous reconnecter.");
      }
      throw new Error("Une erreur est survenue lors de l'affichage de vos commentaires");
    }
  }

  async deleteCommentByUser(token: string, id: number): Promise<string> {
    if (!token) {
      return "Vous devez être connecté pour faire la suppression";
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ["user"],
      });
      if (!currentUser) {
        return "Utilisateur introuvable";
      }
      if (!comment) {
        return "Commentaire introuvable";
      }
      if (comment.user.id !== currentUser.id) {
        return "Vous ne pouvez pas supprimer un commentaires qui ne vous appartient pas";
      }
      await this.commentRepository.delete(id);
      return "ok";
    } catch (error) {
      return "Une erreur est survenue lors de la suppression du commentaire";
    }
  }
}