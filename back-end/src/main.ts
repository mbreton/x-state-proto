import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('X-State example')
    .setDescription('The x-state hexa archi API description')
    .setVersion('1.0')
    .addTag('X-State')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    methods: ['OPTION', 'HEAD', 'GET', 'POST'],
    allowedHeaders: '*',
    origin: 'http://localhost:3000',
  });

  await app.listen(4000);
}

bootstrap();