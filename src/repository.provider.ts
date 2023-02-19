import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { getRepository } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { Repository } from "typeorm/repository/Repository";

@Injectable({ scope: Scope.REQUEST })
export class RepositoryProvider {

  @Inject(REQUEST) private req;

  public getRepository<Entity>(entityClass: EntityTarget<Entity>): Repository<Entity> {

    if (this.req.headers["x-testing-enabled"] == "True") {
      console.log('testing env called');
      return getRepository(entityClass, "test");
    }

    return getRepository(entityClass);
  }

}