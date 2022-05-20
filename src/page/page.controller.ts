import {
  Controller,
  Get,
  HttpStatus,
  Param, Query,
  Redirect,
  Render,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards
} from "@nestjs/common";
import { PageService } from './page.service';
import { AppSession } from '../auth/appsession.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserService } from '../user/user.service';
import { UserAvailableGuard } from '../auth/guards/user.available.guard';
import { RepliqueService } from '../replique/replique.service';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { PageExceptionFilter } from './page.exception.filter';
import { UserOwnsRepliqueGuard } from '../replique/guards/owns.replique.guard';
import { ReponseService } from "../reponse/reponse.service";

@ApiTags('frontend')
@Controller()
@UseFilters(PageExceptionFilter)
@UseGuards(AuthGuard)
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private readonly repliqueService: RepliqueService,
    private readonly reponseService: ReponseService,
    private readonly userService: UserService,
  ) {}

  private readonly REPLIQUES_PER_PAGE: number = 15;

  @Get('/404')
  @Render('index')
  async e404(@AppSession() session) {
    return {
      ...session,
      e404: true,
    };
  }

  @Get(['/', 'feed', 'search'])
  @Render('index')
  //@UseGuards(AuthRequiredGuard)
  async feed(@AppSession() app, @Query('page') page: number, @Query('q') q: string) {
    const r: any = {
      ...app,
      page: { feed: true },
    };

    if (page == undefined) {
      page = 1;
    }
    r.page.n = page;
    r.page.prev = page - 1;
    r.page.next = page + 1;

    if ((q != undefined) && (q != "")) {
      r.repliques = await this.repliqueService.searchRepliques(
        app.session.user.id,
        q,
        this.REPLIQUES_PER_PAGE * (page - 1),
        this.REPLIQUES_PER_PAGE,
      );
      r.search_query = q;
    } else {
      r.repliques = await this.repliqueService.getFeed(
        app.session.user.id,
        this.REPLIQUES_PER_PAGE * (page - 1),
        this.REPLIQUES_PER_PAGE,
      );
    }

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
  //@UseGuards(UserAvailableGuard)
  async profile(@Param('login') login: string, @AppSession() app, @Query('page') page: number) {
    const r: any = {
      ...app,
      page: { profile: true },
    };

    r.user = await this.userService.getUserByURL(login);
    r.page.my = app.session.authorized && app.session.user.login == login;

    if (page == undefined) {
      page = 1;
    }
    r.page.n = page;
    r.page.prev = page - 1;
    r.page.next = page + 1;

    r.repliques = await this.repliqueService.getRepliques(
      app.session.user.id,
      login,
      this.REPLIQUES_PER_PAGE * (page - 1),
      this.REPLIQUES_PER_PAGE,
    );

    return r;
  }

  @Get('u/:login/:repliqueId')
  @Render('index')
  @UseGuards(UserAvailableGuard)
  async getReplique(
    @Param('login') login: string,
    @Param('repliqueId') repliqueId: number,
    @AppSession() app,
  ) {
    const r: any = {
      ...app,
      page: { replique: true },
    };

    r.user = await this.userService.getUserByURL(login);
    r.page.my = app.session.authorized && app.session.user.login == login;

    r.replique = await this.repliqueService.getReplique(
      app.session.user.id,
      repliqueId,
    );
    // r.replique.creationDateTimestamp = r.replique.creationDate?.getTime();
    // r.replique.publicationDateTimestamp = r.replique.publicationDate?.getTime();

    r.replique.reponses = await this.reponseService.getReponses(app.session.user.id, repliqueId);

    r.replique.my =
      app.session.authorized && app.session.user.id == r.replique.creator.id;

    return r;
  }

  @Get('u/:login/:repliqueId/edit')
  @Render('index')
  @UseGuards(UserOwnsRepliqueGuard)
  async editReplique(
    @Param('login') login: string,
    @Param('repliqueId') repliqueId: number,
    @AppSession() app,
  ) {
    const r: any = {
      ...app,
      page: { replique_edit: true },
    };

    r.user = await this.userService.getUserByURL(login);
    r.page.my = app.session.authorized && app.session.user.login == login;

    r.replique = await this.repliqueService.getReplique(
      app.session.user.id,
      repliqueId,
    );
    r.replique.creationDateTimestamp = r.replique.creationDate?.getTime();
    r.replique.publicationDateTimestamp = r.replique.publicationDate?.getTime();
    console.log(r);
    r.replique.my =
      app.session.authorized && app.session.user.id == r.replique.creator.id;
    //r.replique.htmlContent = r.replique.htmlContent();

    if (!r.replique.my) {
      throw new UnauthorizedException(
        'You do not own this replique to edit it.',
      );
    }

    return r;
  }

  @Get('settings')
  @Render('index')
  @UseGuards(AuthRequiredGuard)
  async setting(@AppSession() app) {
    const r: any = {
      ...app,
      page: {
        settings: true,
        tab: { profile: true },
      },
    };

    r.setting = {
      user: await this.userService.getUser(app.session.user.id),
    };
    return r;
  }
}
