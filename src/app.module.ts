import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageService } from './page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';


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
    })
  ],
  controllers: [AppController],
  providers: [AppService, PageService]
})
export class AppModule {}
