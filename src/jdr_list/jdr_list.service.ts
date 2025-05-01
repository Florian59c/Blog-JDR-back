import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateJdrListDto } from './dto/create-jdr_list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JdrList } from './entities/jdr_list.entity';
import { Repository } from 'typeorm';
import { ResponseMessage } from 'src/interfaces/response.interface';

@Injectable()
export class JdrListService {
  constructor(
    @InjectRepository(JdrList)
    private readonly jdrListRepository: Repository<JdrList>, // Injecte le Repository TypeORM
  ) { }

  async createJdrNameInList(createJdrListDto: CreateJdrListDto): Promise<ResponseMessage> {
    const { name } = createJdrListDto;

    try {
      const normalizedName = name.toLowerCase();
      const existName = await this.jdrListRepository.findOneBy({ name: normalizedName })
      if (existName) {
        throw new BadRequestException(`Le JDR ${name} existe déjà`);
      }

      const newJdrName = this.jdrListRepository.create({ name: normalizedName }); // Prépare l'utilisateur
      this.jdrListRepository.save(newJdrName); // Insère dans la base

      return { message: `Le JDR ${name} a bien été ajouté à la liste` };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Un problème est survenu lors de l\'ajout d\'un nouveau JDR dans la liste'
      );
    }
  }

  async findAllJdrNamesByAlphabeticalOrder(): Promise<JdrList[]> {
    try {
      return await this.jdrListRepository.find({
        order: { name: 'ASC' },
        relations: ['jdr'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la récupération des JDR par ordre alphabétique',
      );
    }
  }
}