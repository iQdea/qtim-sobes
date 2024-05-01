import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import config, { getConfigValidationSchema } from './config/app.config';
import { LoggerModule } from "nestjs-pino";
import pino from "pino";
import { Request, Response } from "express";

const ignoredPaths = new Set(['']);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
      validationSchema: getConfigValidationSchema()
    }),
    LoggerModule.forRoot({
      pinoHttp: [
        {
          autoLogging: {
            ignore: (req) => {
              return !!req.url && ignoredPaths.has(req.url);
            }
          },
          serializers: {
            req: (req: Request) => ({
              id: req.id,
              method: req.method,
              url: req.url
            }),
            res: (res: Response) => ({
              statusCode: res.statusCode
            })
          }
        },
        pino.multistream(
          [
            { level: 'trace', stream: process.stdout },
            { level: 'debug', stream: process.stdout },
            { level: 'info', stream: process.stdout },
            { level: 'warn', stream: process.stdout },
            { level: 'error', stream: process.stderr },
            { level: 'fatal', stream: process.stderr }
          ],
          { dedupe: true }
        )
      ]
    }),
    AuthModule,
    ArticlesModule,
    UsersModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
