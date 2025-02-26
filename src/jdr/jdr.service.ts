import { Injectable } from '@nestjs/common';
import { CreateJdrDto } from './dto/create-jdr.dto';
import { UpdateJdrDto } from './dto/update-jdr.dto';

@Injectable()
export class JdrService {
  create(createJdrDto: CreateJdrDto) {
    return 'This action adds a new jdr';
  }

  findAll() {
    return `This action returns all jdr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} jdr`;
  }

  update(id: number, updateJdrDto: UpdateJdrDto) {
    return `This action updates a #${id} jdr`;
  }

  remove(id: number) {
    return `This action removes a #${id} jdr`;
  }
}
