import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthRequiredGuard } from '../../auth/guards/auth.required.guard';

@Injectable()
export class UserOwnsRepliqueGuard extends AuthRequiredGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) {
      return false;
    }

    return true;
  }
}
