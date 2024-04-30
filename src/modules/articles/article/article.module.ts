import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { articleProviders } from './article.providers';
import { DatabaseModule } from '../../database/database.module';
import { UserModule } from '../../users/user/user.module';
import { UserService } from '../../users/user/user.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [ArticleController],
  providers: [
    ...articleProviders,
    UserService,
    ArticleService
  ],
  exports: [
    ...articleProviders
  ]
})
export class ArticleModule {}
