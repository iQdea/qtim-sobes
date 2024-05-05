import { Controller, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CollectionResponse, Endpoint } from '@qdea/swagger-serializer';
import { UserResponseWithIdDto } from './user/dto/user-response.dto';
import { ErrorResponse } from '../../dto/index.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }
  @Endpoint('get', {
    summary: 'Получить всех пользователей',
    collection: [HttpStatus.OK],
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное получение'} }, UserResponseWithIdDto],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Схема пользователя не найдена' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse]
    ]
  })
  async findAll(): CollectionResponse<UserResponseWithIdDto> {
    return {
      dto: UserResponseWithIdDto,
      data: await this.usersService.findAll()
    };
  }
}
