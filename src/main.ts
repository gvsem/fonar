import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as layouts from 'handlebars-layouts';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import supertokens from 'supertokens-node';

import { ApiExceptionFilter } from './api.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  let port = 3000;
  if (process.env?.PORT) {
    port = parseInt(process.env.PORT);
  }

  app.enableCors({
    origin: [process.env?.ApiDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new ApiExceptionFilter());

  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  hbs.registerHelper(layouts(hbs));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      dismissDefaultMessages: false,
      enableDebugMessages: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fonar Social Network')
    .setDescription('The Fonar API description')
    .setVersion('0.7')
    .addTag('fonar')
    .addCookieAuth('sAccessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}

bootstrap();
