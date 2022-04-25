import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import * as supertokens from 'supertokens-node';
import {
  getSession,
  refreshSession,
} from 'supertokens-node/lib/build/recipe/session';
import { User } from '../../user/user.entity';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    const request = ctx.getRequest();
    const resp = ctx.getResponse();

    try {
      request.session = await getSession(ctx.getRequest(), resp);
      request.user = await this.userService.getUserByAuthId(
        request.session.getUserId(),
      );
    } catch (e: any) {
      // we ignore any errors as it is not necessary
    }

    return true;
  }
}
