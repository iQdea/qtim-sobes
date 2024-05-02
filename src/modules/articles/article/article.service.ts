import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { DataSource, ILike, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { UserService } from '../../users/user/user.service';
import { ArticleResponseWithIdDto } from './dto/article-response.dto';
import { merge } from 'lodash';
import { ArticleCache } from './entities/article-cache.entity';

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY') private articleRepository: Repository<Article>,
    @Inject('DATA_SOURCE') private dataSource: DataSource,
    @Inject('ARTICLE_CACHE_REPOSITORY') private articleCacheRepository: Repository<ArticleCache>,
    private readonly userService: UserService,
  ) {}

  async create(article: CreateArticleDto, authorId: string): Promise<ArticleResponseWithIdDto> {
    const newArticle = this.articleRepository.create({
      title: article.title,
      description: article.description,
      author: await this.userService.findOne(authorId)
    });
    const caches = (await this.articleCacheRepository.find({
      where: {
        key: ILike(`%articles_find_%`)
      }
    })).map((x) => x.key)
    await this.dataSource.queryResultCache.remove(caches);
    return await this.articleRepository.save(newArticle);
  }

  async read(id: string): Promise<ArticleResponseWithIdDto> {
    const key = `article_find_${id}`
    const cache = await this.dataSource.queryResultCache.getFromCache({
      identifier: key,
      duration: 300e3
    })
    if (cache) {
      return cache.result;
    }

    const res = await this.articleRepository.findOneOrFail({
      where: { uuid: id },
      relations: ['author']
    });

    await this.dataSource.queryResultCache.storeInCache({
      identifier: key,
      result: res,
      duration: 300e3
    }, {
      identifier: key,
      duration: 300e3
    })
    return res;
  }

  async update(id: string, data: UpdateArticleDto): Promise<ArticleResponseWithIdDto> {
    let article = await this.read(id)
    const updateData = {
      title: data.title ?? undefined,
      description: data.description ?? undefined,
      publishedAt: data.publish !== undefined ? (data.publish ? new Date() : null) : article.publishedAt
    }
    if (data.publish !== undefined) {
      if (data.publish && article.publishedAt) {
        throw new UnprocessableEntityException(`Cannot publish already published article`)
      } else if (!data.publish && !article.publishedAt) {
        throw new UnprocessableEntityException(`Cannot unpublish not published article`)
      }
    }
    article = merge(article, updateData)
    await this.articleRepository.update({ uuid: article.uuid }, article);
    const caches = (await this.articleCacheRepository.find({
      where: {
        key: ILike(`%articles_find_%`)
      }
    })).map((x) => x.key)
    await this.dataSource.queryResultCache.remove([...caches, `article_find_${article.uuid}`])
    return article;
  }

  async remove(id: string): Promise<void> {
    const caches = (await this.articleCacheRepository.find({
      where: {
        key: ILike(`%articles_find_%`)
      }
    })).map((x) => x.key)
    await this.dataSource.queryResultCache.remove([...caches, `article_find_${id}`])
    await this.articleRepository.delete({ uuid: id })
  }
}
