import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PageService } from './page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

var parse = require('pg-connection-string').parse;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      host: parse(process.env.DATABASE_URL).host,
      port: parse(process.env.DATABASE_URL).port,
      username: parse(process.env.DATABASE_URL).user,
      password: parse(process.env.DATABASE_URL).password,
      database: parse(process.env.DATABASE_URL).database,
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
