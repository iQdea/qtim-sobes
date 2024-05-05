import { Body, Controller, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmptyEndpointResponse, Endpoint, EndpointResponse } from '@qdea/swagger-serializer';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserResponseDto, UserResponseWithIdDto } from './dto/user-response.dto';
import { ErrorResponse } from '../../../dto/index.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Endpoint('get', {
    path: ':id',
    summary: 'Получить пользователя',
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное получение'} }, UserResponseDto],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Пользователь или схема пользователя не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse]
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): EndpointResponse<UserResponseDto> {
    const user = await this.userService.findOne(id)
    return {
      dto: UserResponseDto,
      data: user
    };
  }

  @Endpoint('patch', {
    path: ':id',
    summary: 'Обновить пользователя',
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное обновление' } }, UserResponseWithIdDto],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Пользователь или схема пользователя не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse]
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): EndpointResponse<UserResponseWithIdDto> {
    const user = await this.userService.update(id, updateUserDto);
    return {
      dto: UserResponseWithIdDto,
      data: user
    };
  }

  @Endpoint('delete', {
    path: ':id',
    summary: 'Удалить пользователя',
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное удаление'} }],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Пользователь или схема пользователя не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse]
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async remove(@Param('id') id: string): EmptyEndpointResponse {
    await this.userService.remove(id);
  }
}
