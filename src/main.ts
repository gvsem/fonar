import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";
import * as hbs from "hbs";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { ValidationError } from "class-validator";

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule
  );

  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");

  hbs.registerPartials(join(__dirname, "..", "views/partials"));

  let port = 3000;
  if (process.env?.PORT) {
    port = parseInt(process.env.PORT);
  }

  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: false,
    dismissDefaultMessages: false,
    enableDebugMessages: true,
  }));
  
  const config = new DocumentBuilder()
    .setTitle("Fonar Social Network")
    .setDescription("The Fonar API description")
    .setVersion("0.4")
    .addTag("replique")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // app.useGlobalPipes(new ValidationPipe({
  //   disableErrorMessages: false,
  // }));

  await app.listen(port);

}

bootstrap();
