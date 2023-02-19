import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class UserAvailableGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) {
      return false;
    }

    // By default, every user is available
    return true;
  }
}
