import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { AppService } from './app.service';
import { PageService } from './page.service';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService, private readonly pageService: PageService) {
  }

  @Get()
  @Render('index')
  root() {
    return {
      navigation: this.appService.getNavigation(),
      page: this.pageService.getPage('/'),
      session: this.appService.getSession('empty'),
    };
  }


  @Get('/logged')
  @Render('index')
  logged() {
    return {
      navigation: this.appService.getNavigation(),
      page: this.pageService.getPage('/logged'),
      session: this.appService.getSession('empty'),
    };
  }


}
