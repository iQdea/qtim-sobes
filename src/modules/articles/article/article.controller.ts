import { Body, Controller, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { EmptyEndpointResponse, Endpoint, EndpointResponse } from '@qdea/swagger-serializer';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ArticleResponseDto, ArticleResponseWithIdDto } from './dto/article-response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth/jwt-auth.guard';
import { AccessToken } from '../../../decorators/token.decorator';
import { ErrorResponse } from '../../../dto/index.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly jwtService: JwtService
  ) {}

  @Endpoint('post', {
    request: {
      body: CreateArticleDto
    },
    protect: {
      enabled: true,
      guards: [JwtAuthGuard],
      security: {
        name: 'bearer'
      }
    },
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное создание' } }, ArticleResponseWithIdDto],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Статья или схема статей не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse],
      [HttpStatus.UNAUTHORIZED, { schema: { description: 'Требуется авторизация'}}, ErrorResponse]
    ],
    summary: 'Создать статью',
  })
  async create(
    @Body('data') data: CreateArticleDto,
    @AccessToken() token: string
  ): EndpointResponse<ArticleResponseWithIdDto> {
    const { sub: userId } = await this.jwtService.decode(token);
    const article = await this.articleService.create(data, userId);
    return {
      dto: ArticleResponseWithIdDto,
      data: article
    }
  }

  @Endpoint('get', {
    path: ':id',
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное получение' } }, ArticleResponseDto],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Статья или схема статей не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse]
    ],
    summary: 'Прочитать статью по id'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID статьи',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): EndpointResponse<ArticleResponseDto> {
    const article = await this.articleService.read(id)
    return {
      dto: ArticleResponseDto,
      data: article
    }
  }


  @Endpoint('patch', {
    path: ':id',
    request: {
      body: UpdateArticleDto
    },
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное обновление' } }, ArticleResponseWithIdDto],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Статья или схема статей не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse],
      [HttpStatus.UNAUTHORIZED, { schema: { description: 'Требуется авторизация'}}, ErrorResponse]
    ],
    protect: {
      enabled: true,
      guards: [JwtAuthGuard],
      security: {
        name: 'bearer'
      }
    },
    summary: 'Обновить (в тч опубликовать) статью по id'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID статьи',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('data') data: UpdateArticleDto
  ): EndpointResponse<ArticleResponseWithIdDto> {
    const article = await this.articleService.update(id, data);
    return {
      dto: ArticleResponseWithIdDto,
      data: article
    }
  }

  @Endpoint('delete', {
    path: ':id',
    summary: 'Удалить статью по id',
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное удаление' } }],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Статья или схема статей не найдены' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse]
    ],
    protect: {
      enabled: true,
      guards: [JwtAuthGuard]
    }
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID статьи',
    example: 'fee87de1-5f34-4cce-b38b-644e2a99f40f'
  })
  async delete(@Param('id') id: string): EmptyEndpointResponse {
    await this.articleService.remove(id);
  }
}
