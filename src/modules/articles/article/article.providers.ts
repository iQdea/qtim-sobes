import { DataSource } from 'typeorm';
import { Article } from './entities/article.entity';
import { ArticleCache } from './entities/article-cache.entity';

export const articleProviders = [
  {
    provide: 'ARTICLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Article),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ARTICLE_CACHE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ArticleCache),
    inject: ['DATA_SOURCE'],
  },
];
