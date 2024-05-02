import { User } from '../modules/users/user/entities/user.entity';
import { Article } from '../modules/articles/article/entities/article.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { DataSourceOptions } from 'typeorm';
import config from './app.config';

export function typeormConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    logging: config().env === 'development',
    autoLoadEntities: true,
    url: config().database,
    entities: [User, Article],
    synchronize: false,
    cache: config().cache,
    migrations: config().migrations.isEnabled
      ? (
        config().env === 'production'
          ? ["dist/migrations/*.js"]
          : ["src/migrations/*.ts"]
      )
      : [],
  }
}
export function getDataSourceOptions(): DataSourceOptions {
  return typeormConfig() as DataSourceOptions
}
