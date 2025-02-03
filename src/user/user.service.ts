import { Injectable } from '@nestjs/common';
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Injecte le Repository TypeORM
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<string> {
    try {
      const { pseudo, email, password, confirmPassword } = createUserDto;
      const existPseudo = await this.userRepository.findOneBy({ pseudo })
      if (existPseudo) {
        return 'Ce pseudo existe déjà';
      }
      const existEmail = await this.userRepository.findOneBy({ email })
      if (existEmail) {
        return 'Cette adresse mail existe déjà';
      }
      if (password === confirmPassword) {
        const salt = await bcrypt.genSalt(); // Crée un salt (par défaut, 10 rounds)
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = this.userRepository.create({ pseudo, email, password: hashedPassword, role: UserRole.USER }); // Prépare l'utilisateur
        this.userRepository.save(newUser); // Insère dans la base
        return 'ok';
      }
      else {
        return 'Les mots de passe sont différents';
      }
    } catch (error) {
      console.error(error);
      return 'Un problème est survenu lors de la création du compte'
    }
  }

  async getCurrentUser(token: string) {
    try {
      if (!token) {
        throw new Error("Nous n'avons pas trouvé vos informations");
      }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await this.userRepository.findOneBy({ id: decoded.sub });
      if (currentUser !== null) {
        return currentUser;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findUserByMail(getEmailDto: GetEmailDto): Promise<User> {
    const { email } = getEmailDto;
    const findedUser = await this.userRepository.findOneBy({ email });
    if (findedUser !== null) {
      return findedUser;
    } else {
      return null;
    }
  }

  async findUserById(findUserByIdDto: FindUserByIdDto): Promise<User> {
    const { id } = findUserByIdDto;
    // Convertir l'id en number si nécessaire
    const idNumber = Number(id);
    if (isNaN(idNumber)) {
      throw new Error('L\'ID doit être un nombre valide');
    }
    const findedUser = await this.userRepository.findOneBy({ id: idNumber });
    if (findedUser !== null) {
      return findedUser;
    } else {
      return null;
    }
  }

  async updateUser(updateUserDto: UpdateUserDto, token: string): Promise<string> {
    const { pseudo, email } = updateUserDto;
    try {
      if (!token) {
        return "Un problème est survenu lors de l'envoi du formulaire";
      } else {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
        const findedUser = await this.userRepository.findOneBy({ id: decoded.sub });
        findedUser.pseudo = pseudo;
        findedUser.email = email;
        await this.userRepository.save(findedUser);
        return "ok";
      }
    } catch (error) {
      console.error(error);
      return "Une erreur est survenue lors de la modification de votre profil";
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<User> {
    let { id, password } = updatePasswordDto;
    // Vérification et conversion de l'ID
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) {
      throw new Error('L\'ID n\'est pas un nombre valide');
    }
    const user = await this.userRepository.findOneBy({ id: numericId });
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
}