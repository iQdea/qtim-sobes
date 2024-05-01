import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { expressMiddleware } from 'cls-rtracer';
import { v4 as uuid } from 'uuid';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from './filters/exception.filter';
import { ResponseSerializerInterceptor } from '@qdea/swagger-serializer';
import { LoggerErrorInterceptor } from 'nestjs-pino';
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  app.use(cookieParser())
  const configService = app.get(ConfigService);

  app.use(
    expressMiddleware({
      requestIdFactory: (req) => (req.id = uuid())
    })
  );
  const corsOptions = configService.get('cors', { infer: true });
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ResponseSerializerInterceptor(app.get(Reflector), {
      exposeDefaultValues: true,
      exposeUnsetFields: false,
      enableCircularCheck: true
    }),
    new LoggerErrorInterceptor()
  )
  const swConfig = new DocumentBuilder()
    .setTitle('API')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swConfig);
  SwaggerModule.setup('api', app, swaggerDocument, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      filter: true,
      docExpansion: 'none'
    }
  });

  app.enableShutdownHooks();

  const { httpAdapter } = app.get(HttpAdapterHost);
  const config = app.get<ConfigService>(ConfigService);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter, config));

  const port = configService.get('port', { infer: true });
  await app.listen(port);
}
bootstrap();
