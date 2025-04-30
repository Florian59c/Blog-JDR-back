import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { ModifyCommentDto } from './dto/modify-comment.dto';
import { ResponseMessage } from 'src/interfaces/response.interface';

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

  async createComment(createCommentDto: CreateCommentDto, token: string): Promise<ResponseMessage> {
    const { content, postType, postId } = createCommentDto;

    if (!token) {
      throw new UnauthorizedException('Vous devez être connecté pour ajouter un commentaire');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userRepository.findOneBy({ id: decoded.sub });

      if (!user) {
        throw new UnauthorizedException('Utilisateur introuvable, veuillez vous reconnecter.');
      }

      if (postType !== 'hero' && postType !== 'jdr' && postType !== 'news') {
        throw new BadRequestException('Nous n\'avons pas réussi à trouver le post sur lequel vous essayez d\'ajouter un commentaire');
      }

      const repositories = {
        hero: this.heroRepository,
        news: this.newsRepository,
        jdr: this.jdrRepository
      };
      const entity = await repositories[postType].findOneBy({ id: postId });

      if (!entity) {
        throw new NotFoundException('Nous n\'avons pas réussi à trouver le type de post sur lequel vous essayez d\'ajouter un commentaire');
      }

      const newComment = this.commentRepository.create({
        content,
        user,
        [postType]: entity
      });
      await this.commentRepository.save(newComment);

      return { message: 'Votre commentaire a bien été créé' };
    } catch (error) {
      console.error(error);
      throw new Error('Un problème est survenu lors de la création du commentaire');
    }
  }

  // Affiche les commentaires liés à un post (selon le type : hero, jdr, news) avec le pseudo de l'utilisateur ayant ecrit le commentaire
  async getCommentsByPost(getCommentsByPostDto: GetCommentsByPostDto): Promise<Comment[]> {
    const { postType, postId } = getCommentsByPostDto;
    const postTypeMapping: Record<string, string> = {
      hero: 'comment.hero',
      jdr: 'comment.jdr',
      news: 'comment.news',
    };

    const relationColumn = postTypeMapping[postType];
    if (!relationColumn) {
      throw new BadRequestException('Le type de post est invalide');
    }

    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoin('comment.user', 'user')
        .leftJoin(`${relationColumn}`, 'post') // Jointure dynamique sur la relation
        .select([
          'comment.id',
          'comment.content',
          'comment.creation_date',
          'user.pseudo', // Sélectionne uniquement le pseudo
        ])
        .where('post.id = :postId', { postId }) // Filtre sur l'ID du post
        .orderBy('comment.creation_date', 'DESC')
        .getMany();

      if (comments.length === 0) {
        throw new NotFoundException('Aucun commentaire trouvé pour ce post'); // Si aucun commentaire n'est trouvé, lève une exception NotFoundException
      }

      return comments;
    } catch (error) {
      console.error(error);
      throw new Error('Un problème est survenu lors de la récupération des commentaires');
    }
  }

  async reportComment(reportCommentDto: ReportCommentDto, token: string): Promise<ResponseMessage> {
    const { commentId } = reportCommentDto;

    if (!token) {
      throw new UnauthorizedException('Seuls les utilisateurs connectés peuvent signaler un commentaire.');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.userRepository.findOneBy({ id: decoded.sub });
      if (!user) {
        throw new NotFoundException('Utilisateur introuvable.');
      }

      const reportedComment = await this.commentRepository.findOneBy({ id: commentId });
      if (!reportedComment) {
        throw new NotFoundException('Commentaire introuvable.');
      }

      reportedComment.is_report = true;
      await this.commentRepository.save(reportedComment);

      return { message: 'Le commentaire a bien été signalé !' };
    } catch (error) {
      console.error(error);
      if (error instanceof UnauthorizedException || error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error; // Relance proprement les erreurs déjà gérées
      }
      throw new InternalServerErrorException('Une erreur est survenue lors du signalement du commentaire.');
    }
  }

  async getReportedComments(): Promise<Comment[]> {
    try {
      const reportedComments = await this.commentRepository.find({
        where: { is_report: true },
        relations: ['user']
      });

      if (reportedComments.length === 0) {
        throw new NotFoundException('Aucun commentaire signalé trouvé.');
      }

      return reportedComments;
    } catch (error) {
      console.error(error);
      throw new Error('Un problème est survenu lors de la récupération des commentaires signalés.');
    }
  }

  async cancelReportForComment(id: number): Promise<ResponseMessage> {
    if (!id) {
      throw new BadRequestException('L\'id du commentaire est obligatoire.');
    }

    try {
      const comment = await this.commentRepository.findOneBy({ id });
      if (!comment) {
        throw new NotFoundException('Commentaire introuvable.');
      }

      comment.is_report = false;
      await this.commentRepository.save(comment);

      return { message: 'Le signalement du commentaire a bien été annulé' };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de l\'annulation du signalement du commentaire.');
    }
  }

  async getCurrentUserComments(token: string): Promise<Comment[]> {
    if (!token) {
      throw new UnauthorizedException('Seuls les utilisateurs connectés peuvent voir leurs commentaires');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Votre session a expiré. Veuillez vous reconnecter.');
      }
      throw new UnauthorizedException('Jeton invalide');
    }

    const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
    if (!currentUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    try {
      const findedComments = await this.commentRepository.find({
        where: { user: { id: currentUser.id } },
        order: {
          creation_date: 'DESC'
        },
      });

      return findedComments;
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de l\'affichage de vos commentaires');
    }
  }

  async modifyCommentByUser(modifyCommentDto: ModifyCommentDto, token: string): Promise<ResponseMessage> {
    const { commentId, content } = modifyCommentDto;

    if (!token) {
      throw new UnauthorizedException('Vous devez être connecté pour faire la modification');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
      if (!currentUser) {
        throw new NotFoundException('Utilisateur introuvable');
      }

      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['user'],
      });
      if (!comment) {
        throw new NotFoundException('Commentaire introuvable');
      }

      if (comment.user.id !== currentUser.id) {
        throw new ForbiddenException('Vous ne pouvez pas modifier un commentaire qui ne vous appartient pas');
      }

      comment.content = content;
      await this.commentRepository.save(comment);

      return { message: 'Votre commentaire a bien été modifié' };
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la modification du commentaire');
    }
  }

  async deleteCommentByUser(token: string, id: number): Promise<ResponseMessage> {
    if (!token) {
      throw new UnauthorizedException('Vous devez être connecté pour faire la suppression');
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
      if (!currentUser) {
        throw new NotFoundException('Utilisateur introuvable');
      }

      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user'],
      });
      if (!comment) {
        throw new NotFoundException('Commentaire introuvable');
      }

      if (comment.user.id !== currentUser.id) {
        throw new ForbiddenException('Vous ne pouvez pas supprimer un commentaire qui ne vous appartient pas');
      }

      await this.commentRepository.delete(id);

      return { message: 'Votre commentaire à bien été supprimé' };
    } catch (error) {
      throw new InternalServerErrorException('Une erreur est survenue lors de la suppression du commentaire');
    }
  }

  async deleteCommentByAdmin(id: number): Promise<string> {
    if (!id) {
      return 'L\'id du commentaire est obligatoire';
    }
    try {
      const comment = await this.commentRepository.findOneBy({ id });
      if (!comment) {
        return 'Commentaire introuvable';
      }
      await this.commentRepository.delete(id);
      return 'ok';
    } catch (error) {
      return 'Une erreur est survenue lors de la suppression du commentaire';
    }
  }
}