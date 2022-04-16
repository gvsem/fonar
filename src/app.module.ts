import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { PageModule } from './page/page.module';
import { RepliqueModule } from './replique/replique.module';
import { ReponseModule } from './reponse/reponse.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: process.env?.DATABASE_URL,
      type: 'postgres',
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [join(__dirname, '**', 'entities', '*.entity.{ts,js}')],
      synchronize: true, // This for development
      autoLoadEntities: true,
    }),
    PageModule,
    UserModule,
    RepliqueModule,
    ReponseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
