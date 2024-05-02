import { Inject, Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Article } from './article/entities/article.entity';
import { PageService } from './page.service';
import { Generic, QueryGeneric, valueToBoolean } from '../../filters/generic.filter';
import { PaginationArticleResponse } from './article/dto/article-response.dto';
import { CacheKeys } from './article/entities/article-cache.entity';

@Injectable()
export class ArticlesService extends PageService{
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: Repository<Article>,
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('ARTICLE_CACHE_REPOSITORY')
    private CacheKeysRepository: Repository<CacheKeys>
  ) {
    super()
  }

  async findAll(filter: QueryGeneric): Promise<PaginationArticleResponse> {
    const { ...params } = filter;

    const key = `articles_find_${params.page - 1}_${params.pageSize}`
    const query = JSON.stringify(filter)
    const res = await this.dataSource.queryResultCache.getFromCache({
      identifier: key,
      query,
      duration: 300e3
    })

    if (res) {
      return {
        articles: res.result[0],
        meta: {
          itemCount: res.result[0].length,
          currentPage: params.page,
          itemsPerPage: params.pageSize
        }
      };
    }

    const page = await this.paginate(
      this.articleRepository,
      filter,
      ArticlesService.createWhereQuery(params),
      ['author']
    );

    await this.dataSource.queryResultCache.storeInCache({
      identifier: key,
      result: page,
      query,
      duration: 300e3
    }, {
      identifier: key,
      query,
      duration: 300e3
    })

    await this.CacheKeysRepository.save({
      key
    });

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
