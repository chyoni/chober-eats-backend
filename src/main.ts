import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { jwtMiddleware } from './jwt/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  /*
  이게 이제 전역으로 해당 미들웨어를 사용하려면 main에다가 use() 호출하여 붙이면 되는 방법
  원하는대로 사용하면 된다.
  */
  app.use(jwtMiddleware);
  await app.listen(3000);
}
bootstrap();
