import { forwardRef, Module } from '@nestjs/common';

import { User } from './entities/user.entity';
import { Publication } from './entities/publication.entity';
import { Replique } from './entities/replique.entity';
import { Reponse } from './entities/reponse.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
            TypeOrmModule.forFeature([Publication]),
            TypeOrmModule.forFeature([Replique]),
            TypeOrmModule.forFeature([Reponse])
  ],
  controllers: [],
  providers: [], // services
  exports: [Publication, Replique, Reponse, User]
})
export class PublicationModule {
}