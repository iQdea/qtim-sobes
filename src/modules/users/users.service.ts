import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>
  ) {
  }
  async findAll() {
    return await this.userRepository.find()
  }
}
