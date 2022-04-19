import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Replique } from './replique.entity';
import { CreateRepliqueDto } from './dto/create.replique.dto';
import { UpdateRepliqueDto } from './dto/update.replique.dto';
import { UserService } from '../user/user.service';
import { filter } from 'rxjs';

@Injectable()
export class RepliqueService {
  @InjectRepository(Replique)
  private repliqueRepository: Repository<Replique>;

  @Inject(UserService)
  private userService: UserService;

  async getReplique(userId: number, repliqueId: number): Promise<Replique> {
    const r = await this.repliqueRepository.findOne({
      where: { id: repliqueId },
    });
    if (r === undefined) {
      throw new NotFoundException(
        'Replique with id ' + repliqueId + ' not found.',
      );
    }
    return r;
  }

  async createReplique(
    userId: number,
    repliqueDto: CreateRepliqueDto,
  ): Promise<Replique> {
    console.log(repliqueDto);

    const user = await this.userService.getUser(userId);

    const replique = new Replique();
    replique.title = repliqueDto.title;
    replique.abstractText = null;
    replique.content = null;
    replique.creator = user;
    replique.isPublished = false;
    replique.isActive = true;
    replique.creationDate = new Date();

    return await this.repliqueRepository.save(replique);
  }

  async updateReplique(
    userId: number,
    repliqueId: number,
    repliqueDto: UpdateRepliqueDto,
  ): Promise<Replique | undefined> {
    const replique = await this.getReplique(userId, repliqueId);
    if (repliqueDto.title) {
      replique.title = repliqueDto.title;
    }
    if (repliqueDto.content) {
      replique.content = repliqueDto.content;
    }
    if (repliqueDto.abstractText) {
      replique.abstractText = repliqueDto.abstractText;
    }

    return await this.repliqueRepository.save(replique);
  }

  async originateReplique(
    userId: number,
    repliqueId: number,
    originId: number,
  ) {
    const replique = await this.getReplique(userId, repliqueId);
    const oReplique = await this.getReplique(userId, originId);
    replique.discours.push(oReplique);
    await this.repliqueRepository.save(replique);
  }

  async removeOriginatingReplique(
    userId: number,
    repliqueId: number,
    originId: number,
  ) {
    const replique = await this.getReplique(userId, repliqueId);
    const oReplique = await this.getReplique(userId, originId);

    replique.discours.forEach((e, index) => {
      if (e == oReplique) delete replique.discours[index];
    });

    await this.repliqueRepository.save(replique);
  }

  async getRepliques(
    userId: number,
    login: string,
    skip: number,
    quantity: number,
    published?: boolean,
  ) {
    const user = await this.userService.getUser(userId, login);

    const filterOptions = {};
    if (published !== undefined) {
      (filterOptions as any).isPublished = published;
    }

    const [result, total] = await this.repliqueRepository.findAndCount({
      where: { creator: user.id, isActive: true, ...filterOptions },
      order: { publicationDate: 'DESC' },
      take: quantity,
      skip: skip,
    });

    return {
      data: result,
      count: total,
    };
  }

}
