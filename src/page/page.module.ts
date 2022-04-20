import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

console.log(__dirname);

@Module({
  imports: [
    ServeStaticModule.forRoot({rootPath: join(__dirname, '..', '..', 'public'), serveRoot: '/'}),
    //ServeStaticModule.forRoot({rootPath: join(__dirname, '..', '..', 'node_modules'), serveRoot: '/dist'}),
  ],
  controllers: [PageController],
  providers: [PageService],
})
export class PageModule {}
