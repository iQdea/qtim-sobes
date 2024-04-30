import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ArticleModule } from './article/article.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [ArticleModule]
})
export class ArticlesModule {}
