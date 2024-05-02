import { Controller, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Endpoint, EndpointResponse } from '@qdea/swagger-serializer';
import { PaginationArticleResponse } from './article/dto/article-response.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryGeneric } from '../../filters/generic.filter';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Endpoint('get', {
    summary: 'Получить статьи с пагинацией',
    response: PaginationArticleResponse,
    collection: true
  })
  async findAll(@Query() filter: QueryGeneric): EndpointResponse<PaginationArticleResponse> {
    const articles = await this.articlesService.findAll(filter)
    return {
      dto: PaginationArticleResponse,
      data: articles
    };
  }
}
