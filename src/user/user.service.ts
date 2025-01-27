import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetEmailDto } from './dto/get-email.dto';
import { UserRole } from './user-role.enum';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}