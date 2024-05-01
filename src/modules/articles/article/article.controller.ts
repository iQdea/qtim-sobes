import { Controller, Post, Body, Param, ParseUUIDPipe, Request } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { EmptyEndpointResponse, Endpoint, EndpointResponse } from '@qdea/swagger-serializer';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ArticleResponseDto, ArticleResponseWithIdDto } from './dto/article-response.dto';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Endpoint('post', {
    request: {
      body: CreateArticleDto
    },
    response: ArticleResponseDto,
    summary: 'Создать статью',
  })
  @Post()
  async create(
    @Body('data') data: CreateArticleDto,
    @Request() req
  ): EndpointResponse<ArticleResponseDto> {
    console.log(req.user)
    const article = await this.articleService.create(data)
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
    summary: 'Удалить статью по id'
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
