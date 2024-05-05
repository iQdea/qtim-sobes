import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import { CustomQueryResultCache } from '../../config/cache/cache.result';
import { UserResponseWithIdDto } from './user/dto/user-response.dto';

@Injectable()
export class UsersService {
  private readonly cache: CustomQueryResultCache;
  constructor(
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>
  ) {
    this.cache = dataSource.queryResultCache as CustomQueryResultCache;
  }
  async findAll(): Promise<UserResponseWithIdDto[]> {
    const key = `users_find`
    const cached = await this.cache.getFromCache({
      identifier: key,
      duration: 300e3
    })

    const expiredCache = cached ? this.cache.isExpired(cached) : true;

    if (cached && !expiredCache) {
      return cached.result[0];
    }

    const res = await this.userRepository.find();

    await this.cache.storeInCache({
      identifier: key,
      result: res,
      duration: 300e3
    }, {
      identifier: key,
      duration: 300e3
    })

    return res;
  }
}
