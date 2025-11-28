import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seedService = app.get(SeedService);
  await seedService.createStandardUser();
  await app.listen(process.env.PORT ?? 3002, () => {
    console.log('Server running on port 3002');
  });
}
bootstrap();
