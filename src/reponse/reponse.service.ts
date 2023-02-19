import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from "typeorm";

import { Reponse } from './reponse.entity';
import { CreateReponseDto } from './dto/create.reponse.dto';
import { Replique } from '../replique/replique.module';
import { User } from '../user/user.module';
import { RepliqueService } from '../replique/replique.service';
import { UserService } from '../user/user.service';
import { RepositoryProvider } from "../repository.provider";

@Injectable()
export class ReponseService {

  @Inject(RepliqueService)
  private repliqueService: RepliqueService;

  @Inject(UserService)
  private userService: UserService;

  // @InjectRepository(Reponse)
  // private reponseRepository: Repository<Reponse>;

  @Inject(RepositoryProvider) private repositoryProvider;
  private reponseRepository() : Repository<Reponse> {
    return this.repositoryProvider.getRepository(Reponse);
  }

  async getReponsesByReplique(
    userId: number,
    repliqueId: number,
  ): Promise<Reponse[]> {
    const replique = await this.repliqueService.getReplique(userId, repliqueId);
    return replique.reponses;
  }

  async getReponse(userId: number, reponseId: string): Promise<Reponse> {
    const reponse = await this.reponseRepository().findOne({
      where: { id: reponseId },
    });
    if (reponse === undefined) {
      throw new NotFoundException('The following reponse has not been found.');
    }
    return reponse;
  }

  async getReponses(userId: number, repliqueId: number): Promise<Reponse[]> {
    const reponse = await this.reponseRepository().findAndCount({
      relations: [ 'creator' ],
      where: { replique: { id: repliqueId } },
      order: { publicationDate: 'DESC' },
    });
    if (reponse === undefined) {
      throw new NotFoundException('The following replique has not been found.');
    }

    for (const r of reponse[0]) {
      (r as any).creationDateTimestamp = r.creationDate?.getTime();
      (r as any).publicationDateTimestamp = r.publicationDate?.getTime();
    }

    return reponse[0];
  }

  async createReponse(
    userId: number,
    reponseDto: CreateReponseDto,
  ): Promise<Reponse> {
    const replique = await this.repliqueService.getReplique(
      userId,
      reponseDto.repliqueId,
    );
    const user = await this.userService.getUser(userId);

    const reponse = {
      replique: replique,
      creator: user,
      isPublished: true,
      isActive: true,
      creationDate: new Date(),
      publicationDate: new Date(),
      text: reponseDto.text,
    };

    let r = await this.reponseRepository().save(reponse);

    (r as any).creationDateTimestamp = reponse.creationDate?.getTime();
    (r as any).publicationDateTimestamp = reponse.publicationDate?.getTime();

    return r;

  }
}
