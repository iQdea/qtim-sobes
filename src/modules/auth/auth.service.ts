import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/user/dto/create-user.dto';
import { User } from '../users/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async signInUp(user) {
    if (!user) {
      throw new Error('Unauthenticated');
    }

    const userExists = await this.findUserByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.uuid,
    });
  }

  async registerUser(user: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(user);

      await this.userRepository.save(newUser);

      return this.generateJwt({
        sub: newUser.uuid,
      });
    } catch {
      throw new Error('AuthService.registerUser()');
    }
  }

  async findUserByEmail(email) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return user;
  }
}
