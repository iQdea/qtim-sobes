import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseWithIdDto } from './dto/user-response.dto';
import { merge } from 'lodash';
import { createHash } from 'crypto';
import { CustomQueryResultCache } from '../../../config/cache/cache.result';

@Injectable()
export class UserService {
  private readonly cache: CustomQueryResultCache;
  constructor(
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {
    this.cache = dataSource.queryResultCache as CustomQueryResultCache;
  }

  async create(user: CreateUserDto): Promise<UserResponseWithIdDto> {
    const newUser = this.userRepository.create(user);
    const caches = await this.cache.findAll("users_find");
    await this.cache.remove(caches);
    return await this.userRepository.save(newUser);
  }

  async findOne(uuid: string): Promise<UserResponseWithIdDto> {
    const hash = createHash('sha256').update(uuid).digest('hex');
    const keyString = hash.slice(0, 16);
    const key = `user_find_${keyString}`;
    const cached = await this.cache.getFromCache({
      identifier: key,
      duration: 300e3
    })
    const expiredCache = cached ? this.cache.isExpired(cached) : true;

    if (cached && !expiredCache) {
      return cached.result;
    }

    const res = await this.userRepository.findOneOrFail({
      where: {
        uuid
      }
    });

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

  async findOneByEmail(email: string): Promise<UserResponseWithIdDto> {
    const hash = createHash('sha256').update(email).digest('hex');
    const keyString = hash.slice(0, 16);
    const key = `user_find_${keyString}`;
    const cached = await this.cache.getFromCache({
      identifier: key,
      duration: 300e3
    })

    const expiredCache = cached ? this.cache.isExpired(cached) : true;

    if (cached && !expiredCache) {
      return cached.result;
    }
    const res = await this.userRepository.findOne({
      where: {
        email
      }
    });

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

  async update(uuid: string, data: UpdateUserDto): Promise<UserResponseWithIdDto> {
    let user = await this.findOne(uuid);
    user = merge(user, data);
    await this.userRepository.update({ uuid }, data)
    const cacheUsers = await this.cache.findAll("users_find");
    const cacheUser = await this.cache.findAll("user_find_*");
    await this.cache.remove([...cacheUsers, ...cacheUser])
    return user;
  }

  async remove(uuid: string): Promise<void> {
    const cacheUsers = await this.cache.findAll("users_find");
    const cacheUser = await this.cache.findAll("user_find_*");
    await this.cache.remove([...cacheUsers, ...cacheUser])
    await this.userRepository.delete({ uuid });
  }
}
