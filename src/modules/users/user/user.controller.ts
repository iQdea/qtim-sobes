import { Body, Controller, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Endpoint } from '@qdea/swagger-serializer';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserResponseWithIdDto } from './dto/user-response.dto';
import { ErrorResponse } from '../../../dto/index.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Endpoint('get', {
    path: ':id',
    summary: 'Получить пользователя',
    response: [
      [HttpStatus.OK, UserResponseWithIdDto, { schema: { description: 'Удачное получение'} }],
      [HttpStatus.NOT_FOUND, ErrorResponse, { schema: { description: 'Пользователь не найден' }}],
      [HttpStatus.INTERNAL_SERVER_ERROR, ErrorResponse, { schema: { description: 'Системная ошибка' }}]
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.userService.findOne(id);
  }

  @Endpoint('patch', {
    path: ':id',
    summary: 'Обновить пользователя',
    response: [
      [HttpStatus.OK, UserResponseWithIdDto, { schema: { description: 'Удачное обновление' } }],
      [HttpStatus.NOT_FOUND, ErrorResponse, { schema: { description: 'Пользователь не найден' }}],
      [HttpStatus.INTERNAL_SERVER_ERROR, ErrorResponse, { schema: { description: 'Системная ошибка' }}]
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Endpoint('delete', {
    path: ':id',
    summary: 'Удалить пользователя',
    response: [
      [HttpStatus.OK, UserResponseWithIdDto, { schema: { description: 'Удачное удаление'} }],
      [HttpStatus.NOT_FOUND, ErrorResponse, { schema: { description: 'Пользователь не найден' }}],
      [HttpStatus.INTERNAL_SERVER_ERROR, ErrorResponse, { schema: { description: 'Системная ошибка' }}]
    ]
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID пользователя',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async remove(@Param('id') id: string) {
    await this.userService.remove(id);
  }
}
