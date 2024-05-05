import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CustomQueryResultCache } from './config/cache/cache.result';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly cache: CustomQueryResultCache;
  constructor(
    @Inject('DATA_SOURCE') private dataSource: DataSource
  ) {
    this.cache = dataSource.queryResultCache as CustomQueryResultCache;
  }

  async onModuleInit() {
    await this.cache.clear();
  }

  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
