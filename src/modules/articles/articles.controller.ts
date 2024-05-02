import { Controller, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { Endpoint } from '@qdea/swagger-serializer';
import { ArticleResponseWithIdDto } from './article/dto/article-response.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Generic, GenericFilter, QueryGeneric } from '../../filters/generic.filter';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Endpoint('get', {
    summary: 'Получить все статьи',
    response: ArticleResponseWithIdDto,
    collection: true
  })
  async findAll(@Query() filter: QueryGeneric) {
    const articles = await this.articlesService.findAll(filter)
    console.log(articles)
    // return {
    //   dto: ArticleResponseWithIdDto,
    //   data: articles
    // };
  }
}
