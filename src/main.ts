import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import GlobalExceptionHandler from './exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionHandler());
  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`App listening on http://localhost:${PORT}`);
}
bootstrap();