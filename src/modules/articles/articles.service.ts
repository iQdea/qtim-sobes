import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { Article } from './article/entities/article.entity';
import { PageService } from './page.service';
import { Generic, QueryGeneric, valueToBoolean } from '../../filters/generic.filter';
import { PaginationArticleResponse } from './article/dto/article-response.dto';
import { CustomQueryResultCache } from '../../config/cache/cache.result';
import { createHash } from 'crypto';

@Injectable()
export class ArticlesService extends PageService {
  private readonly cache: CustomQueryResultCache;
  constructor(
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: Repository<Article>
  ) {
    super();
    this.cache = dataSource.queryResultCache as CustomQueryResultCache;
  }

  async findAll(filter: QueryGeneric): Promise<PaginationArticleResponse> {
    const { ...params } = filter;

    const fieldsOfArticle = Object.keys(
      this.articleRepository.metadata.propertiesMap || {},
    ).filter(x => x !== 'author')

    if (params.orderBy && !fieldsOfArticle.includes(params.orderBy)) {
      throw new BadRequestException(`orderBy must be one of [${fieldsOfArticle}]`)
    }

    const uniqueString = JSON.stringify(params);
    const hash = createHash('sha256').update(uniqueString).digest('hex');
    const keyString = hash.slice(0, 16);
    const key = `articles_find_${keyString}`;
    const cached = await this.cache.getFromCache({
      identifier: key,
      duration: 300e3
    })

    const expiredCache = cached ? this.cache.isExpired(cached) : true;

    if (cached && !expiredCache) {
      return {
        articles: cached.result[0],
        meta: {
          itemCount: cached.result[0].length,
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

    await this.cache.storeInCache({
      identifier: key,
      result: page,
      duration: 300e3
    }, {
      identifier: key,
      duration: 300e3
    })

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
