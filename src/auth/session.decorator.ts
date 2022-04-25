import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TranslationService } from '../page/translation/translation.service';
import { PageService } from '../page/page.service';

import { AppService } from '../app.service';

export const AppSession = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const tr = TranslationService.getFromHeaders(
      request.headers['accept-languages']?.toString(),
    );
    return {
      tr: tr,
      app: AppService.getAppConfiguration(),
      session: {
        authorized: request.user !== undefined,
        user: {
          userId: request.user?.id,
          login: request.user?.login,
          pageURL: request.user?.pageURL,
          firstName: request.user?.firstName,
          lastName: request.user?.lastName,
        },
      },
      navigation: PageService.getNavigation(tr),
    };
  },
);
