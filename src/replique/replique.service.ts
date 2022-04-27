import {
  Inject,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Replique } from './replique.entity';
import { CreateRepliqueDto } from './dto/create.replique.dto';
import { UpdateRepliqueDto } from './dto/update.replique.dto';
import { UserService } from '../user/user.service';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';

@Injectable()
export class RepliqueService {
  @InjectRepository(Replique)
  private repliqueRepository: Repository<Replique>;

  @Inject(UserService)
  private userService: UserService;

  async getReplique(userId: number, repliqueId: number): Promise<Replique> {
    const r = await this.repliqueRepository.findOne({
      relations: ['creator'],
      where: { id: repliqueId, isActive: true },
    });
    if (r === undefined || (r.creator.id !== userId && !r.isPublished)) {
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
    if (user.id != userId) {
      (filterOptions as any).isPublished = true;
    }

    const [result, total] = await this.repliqueRepository.findAndCount({
      relations: ['creator'],
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

  async getFeed(userId: number, skip: number, quantity: number) {
    const [result, total] = await this.repliqueRepository.findAndCount({
      relations: ['creator'],
      where: { isActive: true, isPublished: true },
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
