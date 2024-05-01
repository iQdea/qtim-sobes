import { Controller } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CollectionResponse, Endpoint } from '@qdea/swagger-serializer';
import { ArticleResponseWithIdDto } from './article/dto/article-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Endpoint('get', {
    summary: 'Получить все статьи',
    response: ArticleResponseWithIdDto,
    collection: true
  })
  async findAll(): CollectionResponse<ArticleResponseWithIdDto> {
    const articles = await this.articlesService.findAll()
    return {
      dto: ArticleResponseWithIdDto,
      data: articles
    };
  }
}
