import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RepliqueModule } from '../replique/replique.module';
import { ReponseModule } from '../reponse/reponse.module';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [
    forwardRef(() => TypeOrmModule.forFeature([User])),
    forwardRef(() => ReponseModule),
    forwardRef(() => RepliqueModule),
  ],
  controllers: [UserController],
  providers: [User, UserService],
  exports: [User, UserService],
})
export class UserModule {}

export { User };
