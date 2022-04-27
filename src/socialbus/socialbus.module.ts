import { forwardRef, Module } from "@nestjs/common";
import { SocialBusGateway } from "./reponse.gateway";
import { UserModule } from "../user/user.module";

@Module({
  providers: [SocialBusGateway],
  imports: [forwardRef(() => UserModule)],
  exports: [SocialBusGateway],
})
export class SocialbusModule {}