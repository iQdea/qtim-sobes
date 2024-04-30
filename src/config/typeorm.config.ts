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
    synchronize: false, // config().env === 'development',
    cache: config().cache,
    migrations: ["*/migrations/*{.ts,.js}"]
  }
}
export function getDataSourceOptions(): DataSourceOptions {
  return typeormConfig() as DataSourceOptions
}