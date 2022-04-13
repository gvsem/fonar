import { forwardRef, Inject, Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";

import { Reponse } from './reponse.entity';
import { CreateReponseDto } from './dto/create.reponse.dto';
import { Replique } from "../replique/replique.module";
import { User } from "../user/user.module";
import { RepliqueService } from "../replique/replique.service";
import { UserService } from "../user/user.service";


@Injectable()
export class ReponseService {

  @Inject(RepliqueService)
  private repliqueService: RepliqueService;

  @Inject(UserService)
  private userService: UserService;

  @InjectRepository(Reponse)
  private reponseRepository: Repository<Reponse>;

  async getReponsesByReplique(userId: number, repliqueId: number): Promise<Reponse[]> {
    const replique = await this.repliqueService.getReplique(userId, repliqueId);
    if (replique === undefined) {
      throw Error('The following replique has not been found.');
    }
    return replique.reponses;
  }

  async getReponse(userId: number, reponseId: string): Promise<Reponse> {
    return await this.reponseRepository.findOne({ where: { id: reponseId } });
  }

  async createReponse(userId: number, reponseDto: CreateReponseDto) : Promise<Reponse> {
    const replique = await this.repliqueService.getReplique(userId, reponseDto.repliqueId);
    if (replique === undefined) {
      throw Error('The following replique has not been found.');
    }

    const user = await this.userService.getUser(userId);
    if (user === undefined) {
      throw Error('The user has not been found.');
    }

    const reponse = new Reponse();
    reponse.replique = replique;
    reponse.creator = user;
    reponse.isPublished = true;
    reponse.isActive = true;
    reponse.creationDate = new Date();
    reponse.text = reponseDto.text;

    return await this.reponseRepository.save(reponse);
  }

}
