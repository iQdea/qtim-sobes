import { Inject, Injectable } from '@nestjs/common';
import { IsNull, Not, Repository } from 'typeorm';
import { Article } from './article/entities/article.entity';
import { PageService } from './page.service';
import { Generic, QueryGeneric, valueToBoolean } from '../../filters/generic.filter';
import { PaginationArticleResponse } from './article/dto/article-response.dto';

@Injectable()
export class ArticlesService extends PageService{
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: Repository<Article>,
  ) {
    super()
  }

  async findAll(filter: QueryGeneric): Promise<PaginationArticleResponse> {
    const { ...params } = filter;

    const page = await this.paginate(
      this.articleRepository,
      filter,
      ArticlesService.createWhereQuery(params),
      ['author']
    );
    return {
      articles: page[0],
      meta: {
        itemCount: page[0].length,
        currentPage: params.page,
        itemsPerPage: params.pageSize
      }
    }
  }

  private static createWhereQuery(params: Generic) {
    const where: any = {};

    if (params.authorId) {
      where.author = { uuid: params.authorId }
    }

    if (valueToBoolean(params.published)) {
      where.publishedAt = Not(IsNull())
    }

    return where;
  }
}
