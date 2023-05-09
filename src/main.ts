import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as compression from 'compression';
import helmet from 'helmet';
import { JwtGuard } from './auth/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const origin: string = config.get<string>('CLIENT');

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(compression());
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Noyon Telecom')
    .setDescription('Noyon Telecom API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['https://noyon-telecom.netlify.app', 'http://localhost:5173'],
    // origin: true,
    credentials: true,
    methods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'DELETE'],
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtGuard(reflector));

  await app.listen(port, () => {
    console.log('[WEB]', `Running server on port: ${port}`);
  });
}
bootstrap();
