import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());
  app.use(cookieParser());

  // Enable CORS for frontend and mobile
  // Enable CORS for frontend and mobile
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : ['http://localhost:8000', 'http://localhost:3000', 'http://localhost:8081', 'http://192.168.100.12:8081', 'http://localhost:8082', 'http://192.168.100.12:8082'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Global Validation Pipe with transformation and whitelist
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Class Serializer for excluding sensitive fields
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('VeriChain API')
    .setDescription('Supply Chain Management & Product Verification API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Products', 'Product management endpoints')
    .addTag('Suppliers', 'Supplier management endpoints')
    .addTag('Tracking', 'Product tracking and traceability')
    .addTag('Analytics', 'Analytics and reporting')
    .addTag('Blockchain', 'Blockchain integration endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 8001;
  await app.listen(port);

  console.log(`\n🚀 VeriChain API running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${port}/auth/*\n`);
}

bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
  process.exit(1);
});
