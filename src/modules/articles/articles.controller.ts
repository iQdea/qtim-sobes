import { Controller, HttpStatus, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Endpoint, EndpointResponse } from '@qdea/swagger-serializer';
import { PaginationArticleResponse } from './article/dto/article-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryGeneric } from '../../filters/generic.filter';
import { ErrorResponse } from '../../dto/index.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Endpoint('get', {
    summary: 'Получить статьи с пагинацией',
    response: [
      [HttpStatus.OK, { schema: { description: 'Удачное получение'} }, PaginationArticleResponse],
      [HttpStatus.NOT_FOUND, { schema: { description: 'Схема статьи не найдена' }}, ErrorResponse],
      [HttpStatus.INTERNAL_SERVER_ERROR, { schema: { description: 'Системная ошибка' }}, ErrorResponse],
      [HttpStatus.BAD_REQUEST, { schema: { description: 'Неверные параметры запроса'}}, ErrorResponse]
    ]
  })
  async findAll(@Query() filter: QueryGeneric): EndpointResponse<PaginationArticleResponse> {
    const articles = await this.articlesService.findAll(filter)
    return {
      dto: PaginationArticleResponse,
      data: articles
    };
  }
}
