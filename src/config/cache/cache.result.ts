import { RedisQueryResultCache } from 'typeorm/cache/RedisQueryResultCache';
import { DataSource } from 'typeorm/data-source/DataSource';

export class CustomQueryResultCache extends RedisQueryResultCache {
  constructor(connection: DataSource, clientType: "redis" | "ioredis" | "ioredis/cluster") {
    super(connection, clientType);
  }

  async findAll(mask: string) {
    return await this.client.keys(mask);
  }
}
