import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reponse } from './reponse.entity';
import { CreateReponseDto } from './dto/create.reponse.dto';
import { Replique } from '../replique/replique.module';
import { User } from '../user/user.module';
import { RepliqueService } from '../replique/replique.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ReponseService {
  @Inject(RepliqueService)
  private repliqueService: RepliqueService;

  @Inject(UserService)
  private userService: UserService;

  @InjectRepository(Reponse)
  private reponseRepository: Repository<Reponse>;

  async getReponsesByReplique(
    userId: number,
    repliqueId: number,
  ): Promise<Reponse[]> {
    const replique = await this.repliqueService.getReplique(userId, repliqueId);
    return replique.reponses;
  }

  async getReponse(userId: number, reponseId: string): Promise<Reponse> {
    const reponse = await this.reponseRepository.findOne({
      where: { id: reponseId },
    });
    if (reponse === undefined) {
      throw new NotFoundException('The following reponse has not been found.');
    }
    return reponse;
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
      text: reponseDto.text,
    };

    return await this.reponseRepository.save(reponse);
  }
}
