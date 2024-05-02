import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CollectionResponse, Endpoint } from '@qdea/swagger-serializer';
import { UserResponseWithIdDto } from './user/dto/user-response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }
  @Endpoint('get', {
    summary: 'Получить всех пользователей',
    response: UserResponseWithIdDto
  })
  async findAll(): CollectionResponse<UserResponseWithIdDto> {
    return {
      dto: UserResponseWithIdDto,
      data: await this.usersService.findAll()
    };
  }
}
