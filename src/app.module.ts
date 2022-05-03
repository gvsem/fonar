import { join } from 'path';

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User, UserModule } from './user/user.module';
import { PageModule } from './page/page.module';
import { RepliqueModule } from './replique/replique.module';
import { ReponseModule } from './reponse/reponse.module';
import { AuthModule } from './auth/auth.module';
import { SocialbusModule } from "./socialbus/socialbus.module";
@Module({
  imports: [
    TypeOrmModule.forRoot({
      url: process.env?.DATABASE_URL,
      type: 'postgres',
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [join(__dirname, '**', 'entities', '*.entity.{ts,js}')],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule.forRoot({
      // These are the connection details of the app you created on supertokens.com
      connectionURI: process.env?.AuthURI,
      apiKey: process.env?.AuthToken,
      appInfo: {
        // Learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
        appName: 'Fonar',
        apiDomain: process.env?.ApiDomain,
        websiteDomain: process.env?.ApiDomain,
      },
    }),
    PageModule,
    UserModule,
    RepliqueModule,
    ReponseModule,
    SocialbusModule,
    forwardRef(() => TypeOrmModule.forFeature([User])),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
