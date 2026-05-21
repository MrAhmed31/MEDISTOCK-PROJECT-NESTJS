import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');
  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`🚀 NestJS Server running on port ${port}`);
}
bootstrap();