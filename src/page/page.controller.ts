import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Redirect,
  Render,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
//import { LoggingInterceptor } from "./logging.interceptor";
import { PageService } from './page.service';
import { TranslationService } from './translation/translation.service';
import { AppSession } from '../auth/session.decorator';
import { SessionContainer } from 'supertokens-node/lib/build/recipe/session/faunadb';

import { Request, Response } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { UserAvailableGuard } from '../auth/guards/user.available.guard';
import { RepliqueService } from '../replique/replique.service';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';
//import { UserService } from "../user/user.service";

@Controller()
//@UseInterceptors(LoggingInterceptor)
@UseGuards(AuthGuard)
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private readonly repliqueService: RepliqueService,
    private readonly userService: UserService,
  ) {}

  @Get('/')
  @Render('index')
  @UseGuards(AuthGuard)
  async index(@AppSession() session) {
    return {
      ...session,
      page: {},
    };
  }

  @Get('feed')
  @Render('index')
  async feed(@AppSession() app) {
    const r: any = {
      ...app,
      page: { all_authors: true },
    };

    r.repliques = await this.repliqueService.getFeed(
      app.session.user.id,
      0,
      20,
    );
    return r;
  }

  @Get('me')
  @Redirect()
  @UseGuards(AuthRequiredGuard)
  async me(@Req() request, @AppSession() app) {
    return {
      statusCode: HttpStatus.FOUND,
      url: '/u/' + app.session.user.pageURL,
    };
  }

  @Get('u/:login')
  @Render('index')
  @UseGuards(UserAvailableGuard)
  async profile(@Param('login') login: string, @AppSession() app) {
    const r: any = {
      ...app,
      page: { profile: true },
    };

    r.user = await this.userService.getUserByURL(login);
    r.user.repliques = await this.repliqueService.getRepliques(
      app.session.user.id,
      login,
      0,
      10,
    );

    return r;
  }
}
