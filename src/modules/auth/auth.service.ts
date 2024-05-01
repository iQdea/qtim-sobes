import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/user/dto/create-user.dto';
import { UserService } from '../users/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  decodeJwt(payload) {
    return this.jwtService.decode(payload);
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
      const newUser = await this.userService.create(user)
      return this.generateJwt({
        sub: newUser.uuid,
      });
    } catch {
      throw new Error('AuthService.registerUser()');
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    return user;
  }
}
