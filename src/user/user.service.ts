import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { GetEmailDto } from './dto/get-email.dto';
import { UserRole } from './user-role.enum';
import { FindUserByIdDto } from './dto/find-user-by-id.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
import { ResponseMessage } from 'src/interfaces/response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Injecte le Repository TypeORM
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<ResponseMessage> {
    const { pseudo, email, password, confirmPassword, checkCGU } = createUserDto;

    const existPseudo = await this.userRepository.findOneBy({ pseudo })
    if (existPseudo) {
      throw new BadRequestException('Ce pseudo existe déjà');;
    }

    const existEmail = await this.userRepository.findOneBy({ email })
    if (existEmail) {
      throw new BadRequestException('Cette adresse mail existe déjà');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Les mots de passe sont différents');
    }

    if (checkCGU !== true) {
      throw new BadRequestException('L\'approbation des conditions générales d\'utilisation est obligatoire');
    }

    try {
      const salt = await bcrypt.genSalt(); // Crée un salt (par défaut, 10 rounds)
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = this.userRepository.create({ pseudo, email, password: hashedPassword, role: UserRole.USER }); // Prépare l'utilisateur
      await this.userRepository.save(newUser); // Insère dans la base

      return { message: 'Votre compte a été créé avec succès' };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la création du compte',
      );
    }
  }

  async getCurrentUser(token: string): Promise<User> {
    if (!token) {
      throw new Error("Nous n'avons pas trouvé vos informations. Si l'erreur persiste, essayez de vous reconnecter");
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOne({
        where: { id: decoded.sub },
        relations: ['comments'],
      });

      if (!currentUser) {
        throw new NotFoundException("L'utilisateur associé au token n'existe pas");
      }

      return currentUser;
    } catch (error) {
      console.error(error);
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la récupération de l’utilisateur',
      );
    }
  }

  findAll(): Promise<User[]> {
    try {
      return this.userRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des utilisateurs');
    }
  }

  async findUserByMail(getEmailDto: GetEmailDto): Promise<User> {
    const { email } = getEmailDto;

    try {
      const findedUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('user.password') // ajoute uniquement le champ exclu
        .getOne();

      if (!findedUser) {
        throw new NotFoundException("Aucun utilisateur trouvé avec cette adresse mail");
      }

      return findedUser;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException("Erreur lors de la recherche de l'utilisateur");
    }
  }

  async findUserById(findUserByIdDto: FindUserByIdDto): Promise<User> {
    const { id } = findUserByIdDto;

    // Convertir l'id en number si nécessaire
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new BadRequestException('L\'ID doit être un nombre valide');
    }

    try {
      const findedUser = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id: idNumber })
        .addSelect('user.password') // Sélection de plusieurs colonnes
        .getOne();

      if (!findedUser) {
        throw new NotFoundException('Utilisateur non trouvé avec cet ID');
      }

      return findedUser;
    } catch (error) {
      console.error(error);

      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erreur lors de la recherche de l\'utilisateur');
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, token: string): Promise<ResponseMessage> {
    const { pseudo, email } = updateUserDto;

    if (!token) {
      throw new BadRequestException("Token manquant ou invalide");
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const findedUser = await this.userRepository.createQueryBuilder('user')
        .where('user.id = :id', { id: decoded.sub })
        .addSelect('user.password') // Sélection des colonnes nécessaires
        .getOne();

      if (!findedUser) {
        throw new NotFoundException("Utilisateur non trouvé");
      }

      // Vérifier si le pseudo ou l'email existe déjà dans la base de données
      const userWithSamePseudo = await this.userRepository.findOne({
        where: { pseudo },
      });
      const userWithSameEmail = await this.userRepository.findOne({
        where: { email },
      });

      // Vérifier si le pseudo ou l'email existe déjà mais appartient à un autre utilisateur
      if (userWithSamePseudo && userWithSamePseudo.id !== findedUser.id) {
        throw new BadRequestException("Le pseudo est déjà utilisé par un autre utilisateur");
      }
      if (userWithSameEmail && userWithSameEmail.id !== findedUser.id) {
        throw new BadRequestException("L'email est déjà utilisé par un autre utilisateur");
      }

      findedUser.pseudo = pseudo;
      findedUser.email = email;
      await this.userRepository.save(findedUser);

      return { message: "Votre profil a bien été modifié" };
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error; // Propager les exceptions spécifiques
      }
      throw new InternalServerErrorException("Une erreur est survenue lors de la modification de votre profil");
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<User> {
    let { id, password } = updatePasswordDto;
    // Vérification et conversion de l'ID
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) {
      throw new Error('L\'ID n\'est pas un nombre valide');
    }
    const user = await this.userRepository.findOne({
      where: { id: numericId },
      select: ['id', 'pseudo', 'email', 'password', 'role', 'register_date'], // Inclure le password explicitement
    });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    // Vérifier si le mot de passe est déjà haché (les mdp hashé avec bcrypt commence par $2a$ ou $2b$)
    const isHashed = password.startsWith('$2b$') || password.startsWith('$2a$');
    // si le mot de passe n'est pas haché, on le hash
    if (!isHashed) {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);
    }
    user.password = password;
    return await this.userRepository.save(user);
  }

  async deleteUser(token: string, res: Response): Promise<string> {
    if (!token) {
      return "Vous devez être connecté pour supprimer votre compte";
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
      if (!currentUser) {
        return "Utilisateur introuvable";
      }
      await this.userRepository.delete(currentUser.id);
      res.clearCookie('auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return "ok";
    } catch (error) {
      return "Une erreur est survenue lors de la suppression du compte";
    }
  }
}