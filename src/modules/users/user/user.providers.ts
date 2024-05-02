import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CacheKeys } from '../../articles/article/entities/article-cache.entity';

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_CACHE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CacheKeys),
    inject: ['DATA_SOURCE'],
  },
];
