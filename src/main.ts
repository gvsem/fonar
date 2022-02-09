import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let port = 3000;
  if (process.env?.PORT) {
    port = parseInt(process.env.PORT);
  }
  await app.listen(port);
}
bootstrap();
