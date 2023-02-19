import { forwardRef, Module } from "@nestjs/common";
import { GlobalBusGateway } from "./global.gateway";
import { UserModule } from "../user/user.module";

@Module({
  providers: [GlobalBusGateway],
  imports: [forwardRef(() => UserModule)],
  exports: [GlobalBusGateway],
})
export class SocialbusModule {}