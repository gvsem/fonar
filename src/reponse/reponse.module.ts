import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RepliqueModule, Replique } from '../replique/replique.module';
import { UserModule, User } from '../user/user.module';

import { Reponse } from '../reponse/reponse.entity';
import { ReponseController } from './reponse.controller';
import { ReponseService } from './reponse.service';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([Replique, Reponse, User])),
    forwardRef(() => RepliqueModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ReponseController],
  providers: [ReponseService, Reponse],
  exports: [ReponseService, Reponse],
})
export class ReponseModule {}

export { Reponse };
