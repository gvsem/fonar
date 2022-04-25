import { Controller, Get, Inject, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { getConnection, Repository } from 'typeorm';
import { RepliqueService } from './replique/replique.service';
import { UserService } from './user/user.service';
import { Reponse } from './reponse/reponse.entity';

import * as emailpassword from 'supertokens-node';
import { DatabaseCleaner } from 'typeorm-database-cleaner';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Get('/reset')
  async reset() {
    const users = await emailpassword.getUsersNewestFirst({ limit: 500 });
    for (const user of users.users) {
      try {
        await emailpassword.deleteUser(user.user.id);
      } catch (e: any) {
        console.log(e);
      }
    }

    try {
      await DatabaseCleaner.clean(getConnection());
    } catch (e: any) {
      console.log(e);
    }

  }
}
