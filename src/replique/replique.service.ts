import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UseGuards
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from "typeorm";

import { Replique } from './replique.entity';
import { CreateRepliqueDto } from './dto/create.replique.dto';
import { UpdateRepliqueDto } from './dto/update.replique.dto';
import { UserService } from '../user/user.service';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';
import { GlobalBusGateway } from "../socialbus/global.gateway";
import { User } from "../user/user.module";
import { REQUEST } from "@nestjs/core";
import { RepositoryProvider } from "../repository.provider";

@Injectable()
export class RepliqueService {

  //@InjectRepository(Replique)
  //private repliqueRepository: Repository<Replique>;

  @Inject(UserService)
  private userService: UserService;

  @Inject(GlobalBusGateway)
  private bus: GlobalBusGateway;

  //@Inject(RepositoryProvider) private repositoryProvider;
  // constructor() {
  //   this.repliqueRepository = this.repositoryProvider.getRepository(Replique);
  // }

  @Inject(RepositoryProvider) private repositoryProvider;
  private repliqueRepository() : Repository<Replique> {
    return this.repositoryProvider.getRepository(Replique);
  }

  async getReplique(userId: number, repliqueId: number): Promise<Replique> {
    const r = await this.repliqueRepository().findOne({
      relations: ['creator', 'discours', 'discours.creator' ],
      where: { id: repliqueId, isActive: true },
    });
    if (r === undefined || (r.creator.id !== userId && !r.isPublished)) {
      throw new NotFoundException(
        'Replique with id ' + repliqueId + ' not found.',
      );
    }
    (r as any).creationDateTimestamp = r.creationDate?.getTime();
    (r as any).publicationDateTimestamp = r.publicationDate?.getTime();
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
    replique.content = "[]";
    replique.creator = user;
    replique.isPublished = false;
    replique.isActive = true;
    replique.creationDate = new Date();

    return await this.repliqueRepository().save(replique);
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

    return await this.repliqueRepository().save(replique);
  }

  async originateReplique(
    userId: number,
    repliqueId: number,
    originId: number,
  ) {
    const replique = await this.getReplique(userId, repliqueId);
    const oReplique = await this.getReplique(userId, originId);
    replique.discours.push(oReplique);
    await this.repliqueRepository().save(replique);
  }

  async removeOriginatingReplique(
    userId: number,
    repliqueId: number,
    originId: number,
  ) {
    const replique = await this.getReplique(userId, repliqueId);
    const oReplique = await this.getReplique(userId, originId);

    replique.discours.forEach((e, index) => {
      if (e.id == oReplique.id) delete replique.discours[index];
    });

    await this.repliqueRepository().save(replique);
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

    const [result, total] = await this.repliqueRepository().findAndCount({
      relations: ['creator', 'discours', 'discours.creator'],
      where: { creator: user.id, isActive: true, ...filterOptions },
      order: { publicationDate: 'DESC' },
      take: quantity,
      skip: skip,
    });

    for (const r of result) {
      (r as any).creationDateTimestamp = r.creationDate?.getTime();
      (r as any).publicationDateTimestamp = r.publicationDate?.getTime();
    }

    return {
      data: result,
      count: total,
      length: quantity,
      has_more: total - skip - quantity,
      is_first_page: (skip == 0),
      is_last_page: (total - skip - quantity <= 0),
    };
  }

  async getFeed(userId: number, skip: number, quantity: number) {
    const [result, total] = await this.repliqueRepository().findAndCount({
      relations: ['creator', 'discours', 'discours.creator'],
      where: { isActive: true, isPublished: true },
      order: { publicationDate: 'DESC' },
      take: quantity,
      skip: skip,
    });

    for (const r of result) {
      (r as any).creationDateTimestamp = r.creationDate?.getTime();
      (r as any).publicationDateTimestamp = r.publicationDate?.getTime();
    }

    return {
      data: result,
      count: total,
      length: quantity,
      has_more: total - skip - quantity,
      is_first_page: (skip == 0),
      is_last_page: (total - skip - quantity <= 0),
    };
  }

  async publishReplique(userId: number, repliqueId: number) {
    const replique = await this.getReplique(userId, repliqueId);
    if (replique.isPublished) {
      throw new BadRequestException("Replique with id " + repliqueId + " is already published.");
    }
    replique.isPublished = true;
    replique.publicationDate = new Date();
    const r = await this.repliqueRepository().save(replique);
    await this.bus.notifyAboutNewReplique(r);
    return r;
  }

  async deleteReplique(userId: number, repliqueId: number) {
    const replique = await this.getReplique(userId, repliqueId);
    replique.isActive = false;
    return await this.repliqueRepository().save(replique);
  }

  async searchRepliques(userId: number, query: string, skip: number, quantity: number) {
    const [result, total] = await this.repliqueRepository().createQueryBuilder("replique")
      .select([
        'replique',
        'creator'
      ])
      .where({ 'isActive': true, 'isPublished': true })
      .andWhere('title ILIKE :query OR "abstractText" ILIKE :query OR content ILIKE :query', {
        query: `%${query}%`
      })
      .leftJoin('replique.creator', 'creator')
      .skip(skip)
      .take(quantity)
      //.orderBy('"publicationDate"','DESC')
      .getManyAndCount();

    for (const r of result) {
      (r as any).creationDateTimestamp = r.creationDate?.getTime();
      (r as any).publicationDateTimestamp = r.publicationDate?.getTime();
    }

    return {
      data: result,
      count: total,
      length: quantity,
      has_more: total - skip - quantity,
      is_first_page: (skip == 0),
      is_last_page: (total - skip - quantity <= 0),
    };
  }

  async getOrigins(userId: number, repliqueId: number) : Promise<Replique[]> {
    let r = (await this.getReplique(userId, repliqueId));
    return r.discours;
  }
}
