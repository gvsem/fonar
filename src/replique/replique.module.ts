import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule, User } from '../user/user.module';
import { ReponseModule, Reponse } from '../reponse/reponse.module';

// import { Publication } from './publication.entity';
import { Replique } from './replique.entity';
import { RepliqueController } from './replique.controller';
import { RepliqueService } from './replique.service';
import { SocialbusModule } from "../socialbus/socialbus.module";
import { RepositoryProvider } from "../repository.provider";
import { AppModule } from "../app.module";

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([Replique, Reponse, User])),
    forwardRef(() => ReponseModule),
    forwardRef(() => UserModule),
    forwardRef(() => SocialbusModule),
    RepositoryProvider
  ],
  controllers: [RepliqueController],
  providers: [RepliqueService, Replique],
  exports: [RepliqueService, Replique],
})
export class RepliqueModule {}

export { Replique };
