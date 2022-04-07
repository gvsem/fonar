import { Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reponse } from './reponse.entity';
import { CreateReponseDto } from './dto/create.reponse.dto';

@Injectable()
export class ReponseService {
  @InjectRepository(Reponse)
  private reponseRepository: Repository<Reponse>;

  getReponsesByReplique(userId: number, repliqueId: string): Promise<Reponse[] | undefined> {
    throw new NotImplementedException();
  }

  getReponse(userId: number, reponseId: string): Promise<Reponse | undefined> {
    throw new NotImplementedException();
  }

  createReponse(userId: number, reponseDto: CreateReponseDto) : Promise<Reponse | undefined> {
    throw new NotImplementedException();
  }

}
