import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateJdrDto } from './dto/create-jdr.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jdr } from './entities/jdr.entity';
import { JdrList } from 'src/jdr_list/entities/jdr_list.entity';
import { GetsortedJdrDto } from './dto/get-sorted-jdr.dto';
import { ResponseMessage } from 'src/interfaces/response.interface';

@Injectable()
export class JdrService {
  constructor(
    @InjectRepository(Jdr)
    private readonly jdrRepository: Repository<Jdr>, // Injecte le Repository TypeORM
    @InjectRepository(JdrList) // Ajout du repository pour JdrList
    private readonly jdrListRepository: Repository<JdrList>,
  ) { }

  async createJdr(createJdrDto: CreateJdrDto): Promise<ResponseMessage> {
    const { title, link, is_scenario, jdr_list_id } = createJdrDto;

    try {
      const existTitle = await this.jdrRepository.findOneBy({ title });
      if (existTitle) {
        throw new BadRequestException('Le titre du document existe déjà');
      }

      const existLink = await this.jdrRepository.findOneBy({ link });
      if (existLink) {
        throw new BadRequestException('Le lien du document existe déjà');
      }

      // Récupération de l'entité JdrList
      const jdrList = await this.jdrListRepository.findOneBy({ id: jdr_list_id });
      if (!jdrList) {
        throw new BadRequestException('Le nom du JDR spécifié n\'existe pas dans la liste');
      }

      const newJdr = this.jdrRepository.create({
        title,
        link,
        is_scenario,
        jdr_list: jdrList
      });
      await this.jdrRepository.save(newJdr);

      return { message: `L${is_scenario ? 'e scénario' : '\'aide de jeu'} a bien été créé${is_scenario ? '' : 'e'}` };
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la création d\'un JDR',
      );
    }
  }

  // lorsque jdrName === default, Donne la liste des scénarios si 'is_scenario' passé dans le body est vrai. Donne la liste des aide de jeu sinon.
  // lorsque jdrName !== default, vérifie si la valeur de jdrName correspond à un nom de JDR dans la BDD 'jdrList'
  // Si c'est le cas, donne la liste des scénarios ou des aide jeu trié par nom du JDR souhaité
  async getsortedJdr(getsortedJdrDto: GetsortedJdrDto): Promise<Jdr[]> {
    const { is_scenario, jdrName } = getsortedJdrDto;

    try {
      if (jdrName !== 'default') {
        const jdrList = await this.jdrListRepository.findOne({
          where: { name: jdrName },
        });

        if (!jdrList) {
          throw new BadRequestException(`Le nom '${jdrName}' n'a pas été trouvé dans la liste de JDR`);
        }
      }

      const jdrs = await this.jdrRepository.find({
        where: jdrName === 'default'
          ? { is_scenario }
          : { is_scenario, jdr_list: { name: jdrName } },
        order: { date: 'DESC' },
        relations: ['comments', 'jdr_list'],
      });

      return jdrs;
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Une erreur est survenue lors de la récupération des JDR.');
    }
  }

  async findAllJdrWithNewDate(): Promise<Jdr[]> {
    try {
      return await this.jdrRepository.find({
        order: { date: 'DESC' },
        relations: ['comments'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Un problème est survenu lors de la récupération des JDR.'
      );
    }
  }
}