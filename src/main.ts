import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { RootModule } from './root.module';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);
  app.enableCors();
  console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
  await app.listen(process.env.PORT ?? 3002);
  console.log(`Server is running on ${process.env.PORT ?? 3002} Port`);
}
void bootstrap();
