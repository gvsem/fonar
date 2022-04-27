import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Redirect,
  Render,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { AppSession } from '../auth/session.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserService } from '../user/user.service';
import { UserAvailableGuard } from '../auth/guards/user.available.guard';
import { RepliqueService } from '../replique/replique.service';
import { AuthRequiredGuard } from '../auth/guards/auth.required.guard';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { PageExceptionFilter } from './page.exception.filter';
import { UserOwnsRepliqueGuard } from '../replique/guards/owns.replique.guard';
import { SocialBusGateway } from "../socialbus/reponse.gateway";

@ApiTags('frontend')
@Controller()
@UseFilters(new PageExceptionFilter())
@UseGuards(AuthGuard)
export class PageController {
  constructor(
    private readonly pageService: PageService,
    private readonly repliqueService: RepliqueService,
    private readonly userService: UserService,
    private readonly bus: SocialBusGateway
  ) {}

  @Get('/')
  @Render('index')
  async index(@AppSession() session) {
    return {
      ...session,
      page: {},
    };
  }

  @Get('feed')
  @Render('index')
  @UseGuards(AuthRequiredGuard)
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
    r.page.my = app.session.authorized && app.session.user.login == login;

    r.user.repliques = await this.repliqueService.getRepliques(
      app.session.user.id,
      login,
      0,
      10,
    );

    await this.bus.notifyVisitor(r.user.id, app.session.user.authorAlias);

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
    r.replique.my =
      app.session.authorized && app.session.user.id == r.replique.creator.id;
    //r.replique.htmlContent = r.replique.htmlContent();

    console.log(r.replique);
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
    r.replique.my =
      app.session.authorized && app.session.user.id == r.replique.creator.id;
    //r.replique.htmlContent = r.replique.htmlContent();

    if (!r.replique.my) {
      throw new UnauthorizedException(
        'You do not own this replique to edit it.',
      );
    }

    console.log(r.replique);
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
