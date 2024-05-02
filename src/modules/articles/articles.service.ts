import { Inject, Injectable } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { Article } from './article/entities/article.entity';
import { PageService } from './page.service';
import { Generic, QueryGeneric } from '../../filters/generic.filter';

@Injectable()
export class ArticlesService extends PageService{
  constructor(
    @Inject('ARTICLE_REPOSITORY')
    private articleRepository: Repository<Article>,
  ) {
    super()
  }

  async findAll(filter: QueryGeneric) {
    console.log(filter)
    const { ...params } = filter;

    const res = await this.articleRepository.find({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * (filter.pageSize + 1),
      take: filter.pageSize,
      where: ArticlesService.createWhereQuery(params),
      relations: ['author'],
      cache: true
    })
    console.log(res)
    // return await this.paginate(
    //   this.articleRepository,
    //   filter,
    //   ArticlesService.createWhereQuery(params),
    //   ['author']
    // );
  }

  private static createWhereQuery(params: Generic) {
    const where: any = {};

    if (params.authorId) {
      where.author.id = params.authorId
    }

    if (params.published) {
      where.publishedAt = Not(null)
    }

    return where;
  }
}
