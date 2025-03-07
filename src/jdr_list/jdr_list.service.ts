import { Injectable } from '@nestjs/common';
import { CreateJdrListDto } from './dto/create-jdr_list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JdrList } from './entities/jdr_list.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JdrListService {
  constructor(
    @InjectRepository(JdrList)
    private readonly jdrListRepository: Repository<JdrList>, // Injecte le Repository TypeORM
  ) { }

  async createJdrNameInList(createJdrListDto: CreateJdrListDto): Promise<string> {
    const { name } = createJdrListDto;
    try {
      const normalizedName = name.toLowerCase();
      const existName = await this.jdrListRepository.findOneBy({ name: normalizedName })
      if (existName) {
        return 'Le nom du JDR existe déjà';
      }
      const newJdrName = this.jdrListRepository.create({ name: normalizedName }); // Prépare l'utilisateur
      this.jdrListRepository.save(newJdrName); // Insère dans la base
      return "ok";
    } catch (error) {
      console.error(error);
      return "Un problème est survenu lors de l'ajout d'un nouveau JDR dans la liste";
    }
  }

  findAllJdrNamesByAlphabeticalOrder(): Promise<JdrList[]> {
    return this.jdrListRepository.find({
      order: { name: 'ASC' },
      relations: ['jdr'],
    });
  }
}