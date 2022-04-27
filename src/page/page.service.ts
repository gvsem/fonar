import { Injectable } from '@nestjs/common';
import { TranslationService } from './translation/translation.service';
import { AppService } from '../app.service';

@Injectable()
export class PageService {
  constructor() {}

  static getNavigation(tr: any): any {
    return {
      menu: [
        {
          title: tr.navigation.feed,
          href: AppService.getAppConfiguration().links.feed,
          active: true,
        },
        {
          title: tr.navigation.all_users,
          href: AppService.getAppConfiguration().links.all_users,
          active: true,
          items: [
            {
              title: 'Николай Гумилев',
              href: '/u/gumilev',
            },
            { divider: true },
          ],
        },
        {
          title: tr.navigation.my_page,
          href: AppService.getAppConfiguration().links.my_page,
          active: true,
        },
      ],
    };
  }
}
