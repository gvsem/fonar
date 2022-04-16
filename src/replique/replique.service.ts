import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Replique } from './replique.entity';
import { CreateRepliqueDto } from './dto/create.replique.dto';
import { UpdateRepliqueDto } from './dto/update.replique.dto';

@Injectable()
export class RepliqueService {
  @InjectRepository(Replique)
  private repliqueRepository: Repository<Replique>;

  getReplique(
    userId: number,
    repliqueId: string,
  ): Promise<Replique | undefined> {
    throw new NotImplementedException();
    // return this.repliqueRepository.findOne({ where: { id: repliqueId } });
  }

  createReplique(
    userId: number,
    repliqueDto: CreateRepliqueDto,
  ): Promise<Replique | undefined> {
    throw new NotImplementedException();
    // const replique = new Replique();
    // replique.title = repliqueDto.title;
    // return this.repliqueRepository.save(replique);
  }

  updateReplique(
    userId: number,
    dto: UpdateRepliqueDto,
  ): Promise<Replique | undefined> {
    throw new NotImplementedException();
  }

  originateReplique(userId: number, repliqueId : string, originId: string) : Promise<boolean> {
    throw new NotImplementedException();
  }

  removeOriginatingReplique(userId: number, repliqueId: string, originId: string) : Promise<boolean> {
    throw new NotImplementedException();
  }

}
