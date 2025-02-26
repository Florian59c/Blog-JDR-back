import { Injectable } from '@nestjs/common';
import { CreateJdrListDto } from './dto/create-jdr_list.dto';
import { UpdateJdrListDto } from './dto/update-jdr_list.dto';

@Injectable()
export class JdrListService {
  create(createJdrListDto: CreateJdrListDto) {
    return 'This action adds a new jdrList';
  }

  findAll() {
    return `This action returns all jdrList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jdrList`;
  }

  update(id: number, updateJdrListDto: UpdateJdrListDto) {
    return `This action updates a #${id} jdrList`;
  }

  remove(id: number) {
    return `This action removes a #${id} jdrList`;
  }
}
