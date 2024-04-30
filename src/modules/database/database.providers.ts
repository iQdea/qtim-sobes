import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        // TODO: use config
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'user',
        password: 'password',
        database: 'articles',
        entities: [
          __dirname + '/../**/*.entity.(ts|js)',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
