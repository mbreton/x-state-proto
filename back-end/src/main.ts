import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './exception-filter';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addOpenApi(app);
  addGlobalExceptionFilter(app);
  addCors(app);
  await app.listen(4000);
}

function addOpenApi(app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('X-State example')
    .setDescription('The x-state hexa archi API description')
    .setVersion('1.0')
    .addTag('X-State')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

function addGlobalExceptionFilter(app: INestApplication<any>) {
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));
}

function addCors(app: INestApplication<any>) {
  app.enableCors({
    methods: ['OPTION', 'HEAD', 'GET', 'POST'],
    allowedHeaders: '*',
    origin: 'http://localhost:3000',
  });
}

bootstrap();
