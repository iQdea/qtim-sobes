import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { articleProviders } from './article.providers';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../../users/user/user.module';
import { UserService } from '../../users/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app.config';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<AppConfig, true>) => ({
        global: true,
        secret: configService.get('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn', { infer: true }),
        },
      }),
    }),
  ],
  controllers: [ArticleController],
  providers: [
    ...articleProviders,
    UserService,
    ArticleService
  ],
  exports: [
    ...articleProviders,
    DatabaseModule
  ]
})
export class ArticleModule {}
