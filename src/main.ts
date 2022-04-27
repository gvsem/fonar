import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';
import * as exphbs from 'express-handlebars';
import * as layouts from 'handlebars-layouts';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import supertokens from 'supertokens-node';
import { SupertokensExceptionFilter } from './auth/auth.filter';

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

  // let handlebars = hbs.create({
  //     extname: "hbs",
  //     defaultLayout: "index",
  //     layoutsDir: join(__dirname, "..", "views", "layouts"),
  //     partialsDir: join(__dirname, "..", "views", "partials"),
  //     helpers: layouts(hbs),
  //   });//.registerHelper(layouts(hbs))

  console.log(layouts(exphbs));

  // var hbs = exphbs.create({
  //   helpers: {
  //     sayHello: function () { alert("Hello World") },
  //     getStringifiedJson: function (value) {
  //       return JSON.stringify(value);
  //     },
  //     //...layouts(exphbs)
  //   },
  //   defaultLayout: 'main',
  //   partialsDir: [join(__dirname, "..", 'views', 'partials')],
  //   layoutsDir: join(__dirname, "..", 'views', 'layouts') // join(__dirname, "..", 'views', 'partials')
  // });

  // app.engine('handlebars', hbs.engine);
  // app.set("view engine", "handlebars");
  // app.set('views', join(__dirname, "..", 'views'));

  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  // for (var i in layouts(exphbs)) {
  //   hbs.registerHelper(i);
  // }
  //hbs.helpers.register(layouts(hbs.engine));

  hbs.registerHelper(layouts(hbs));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  //hbs.compile()

  // hbs.create({
  //   extname: 'hbs',
  //   defaultLayout: 'layout_main',
  //   layoutsDir: join(__dirname, '..', 'views', 'layouts'),
  //   partialsDir: join(__dirname, '..', 'views', 'partials'),
  //   // helpers: { printName },
  // });

  //app.setViewEngine('hbs');
  // hbs.registerPartials(join(__dirname, "..", "views/partials"));
  // hbs.registerHelper(layouts(hbs));

  //let hbs
  //layouts.register(hbs);

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
    .setVersion('0.4')
    .addTag('fonar')
    .addCookieAuth('sAccessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}

bootstrap();
