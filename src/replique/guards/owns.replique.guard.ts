import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthRequiredGuard } from '../../auth/guards/auth.required.guard';
import { RepliqueService } from '../replique.service';

@Injectable()
export class UserOwnsRepliqueGuard extends AuthRequiredGuard {
  @Inject(RepliqueService)
  private repliqueService: RepliqueService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) {
      return false;
    }

    const rId = context.switchToHttp().getRequest().params.repliqueId;
    const uId = context.switchToHttp().getRequest().user.id;
    return uId == (await this.repliqueService.getReplique(uId, rId)).creator.id;
  }
}
