import { DataSource } from 'typeorm';
import { getDataSourceOptions } from '../../config/typeorm.config';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource(getDataSourceOptions());
      return dataSource.initialize();
    },
  },
];
