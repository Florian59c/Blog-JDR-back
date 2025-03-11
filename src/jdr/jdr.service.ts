import { Injectable } from '@nestjs/common';
import { CreateJdrDto } from './dto/create-jdr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jdr } from './entities/jdr.entity';
import { JdrList } from 'src/jdr_list/entities/jdr_list.entity';
import { GetJdrByTypeDto } from './dto/Get-jdr-by-type.dto';

@Injectable()
export class JdrService {
  constructor(
    @InjectRepository(Jdr)
    private readonly jdrRepository: Repository<Jdr>, // Injecte le Repository TypeORM
    @InjectRepository(JdrList) // Ajout du repository pour JdrList
    private readonly jdrListRepository: Repository<JdrList>,
  ) { }

  async createJdr(createJdrDto: CreateJdrDto): Promise<string> {
    const { title, link, is_scenario, jdr_list_id } = createJdrDto;
    try {
      const existTitle = await this.jdrRepository.findOneBy({ title });
      if (existTitle) {
        return 'Le titre du document existe déjà';
      }
      const existLink = await this.jdrRepository.findOneBy({ link });
      if (existLink) {
        return 'Le lien du document existe déjà';
      }
      // Récupération de l'entité JdrList
      const jdrList = await this.jdrListRepository.findOneBy({ id: jdr_list_id });
      if (!jdrList) {
        return "Le nom du JDR spécifiée n'existe pas dans la liste.";
      }
      const newJdr = this.jdrRepository.create({
        title,
        link,
        is_scenario,
        jdr_list: jdrList
      });
      await this.jdrRepository.save(newJdr);
      return "ok";
    } catch (error) {
      console.error(error);
      return "Un problème est survenu lors de la création d'un JDR";
    }
  }

  // Donne la liste des scénarios si "is_scenario" passé dans le body est vrai. Donne la liste des aide de jeu sinon.
  async getJdrByType(getJdrByTypeDto: GetJdrByTypeDto) {
    const { is_scenario } = getJdrByTypeDto;
    return this.jdrRepository.find({
      where: { is_scenario },
      order: { date: 'DESC' },
      relations: ['comments', 'jdr_list'], // Charge les commentaires et le nom du JDR liés aux JDR
    });
  }
}