import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable
} from "@nestjs/common";
import { Error as STError } from "supertokens-node";

//import * as session from "supertokens-node/recipe/session/framework/express";
import * as supertokens from "supertokens-node";
import {
  getSession, getSessionInformation,
  refreshSession
} from "supertokens-node/lib/build/recipe/session";
import { User } from "../../user/user.entity";
import { UserService } from "../../user/user.service";


@Injectable()
export class SocialbusGuard implements CanActivate {
  @Inject(UserService)
  protected userService: UserService;

  async canActivate(
    context: any
  ): Promise<boolean> {

    try {
      const ctx = context.switchToWs();
      const token = context.args[0].handshake.headers.authorization.split(" ")[1];
      const s = await getSessionInformation(token);
      const u = await this.userService.getUserByAuthId(s.userId);
    } catch (e: any) {
      console.log(e);
      return false;
    }

    return true;

  }
}
