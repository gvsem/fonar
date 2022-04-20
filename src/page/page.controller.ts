import { Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { PageService } from './page.service';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Get('/main')
  @Render('index')
  root() {
    return {
      navigation: this.pageService.getNavigation(),
      page: this.pageService.getPage('/'),
      session: this.pageService.getSession('empty'),
    };
  }

  @Get('/logged')
  @Render('index')
  logged() {
    return {
      navigation: this.pageService.getNavigation(),
      page: this.pageService.getPage('/logged'),
      session: this.pageService.getSession('empty'),
    };
  }
}
