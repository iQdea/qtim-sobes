import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserResponseWithIdDto } from './dto/user-response.dto';
import { merge } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<UserResponseWithIdDto> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  async findOne(uuid: string): Promise<UserResponseWithIdDto> {
    return await this.userRepository.findOneOrFail({
      where: {
        uuid
      }
    });
  }

  async findOneByEmail(email: string): Promise<UserResponseWithIdDto> {
    return await this.userRepository.findOne({
      where: {
        email
      }
    });
  }

  async update(uuid: string, data: UpdateUserDto): Promise<UserResponseWithIdDto> {
    let user = await this.findOne(uuid);
    user = merge(user, data);
    await this.userRepository.update({ uuid }, data)
    return user;
  }

  async remove(uuid: string): Promise<void> {
    await this.userRepository.delete({ uuid });
  }
}
