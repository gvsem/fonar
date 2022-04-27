import { forwardRef, Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TranslationService } from './translation/translation.service';
import { UserModule } from '../user/user.module';
import { RepliqueModule } from '../replique/replique.module';
import { SocialbusModule } from "../socialbus/socialbus.module";

console.log(__dirname);

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      serveRoot: '/',
    }),
    forwardRef(() => UserModule),
    forwardRef(() => RepliqueModule),
    forwardRef(() => SocialbusModule),
  ],
  controllers: [PageController],
  providers: [PageService, TranslationService],
  exports: [PageService],
})
export class PageModule {}
