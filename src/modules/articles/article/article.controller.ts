import { Controller, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { EmptyEndpointResponse, Endpoint, EndpointResponse } from '@qdea/swagger-serializer';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ArticleResponseDto, ArticleResponseWithIdDto } from './dto/article-response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/jwt-auth/jwt-auth.guard';
import { AccessToken } from '../../../decorators/token.decorator';

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
      guards: [JwtAuthGuard]
    },
    response: ArticleResponseDto,
    summary: 'Создать статью',
  })
  async create(
    @Body('data') data: CreateArticleDto,
    @AccessToken() token: string
  ): EndpointResponse<ArticleResponseDto> {
    const { sub: userId } = await this.jwtService.decode(token);
    const article = await this.articleService.create(data, userId);
    return {
      dto: ArticleResponseDto,
      data: article
    }
  }

  @Endpoint('get', {
    path: ':id',
    response: ArticleResponseDto,
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
    response: ArticleResponseWithIdDto,
    protect: {
      enabled: true,
      guards: [JwtAuthGuard]
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
