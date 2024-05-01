import { Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { UserService } from '../../users/user/user.service';
import { ArticleResponseDto, ArticleResponseWithIdDto } from './dto/article-response.dto';
import { merge } from 'lodash';

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY') private articleRepository: Repository<Article>,
    private readonly userService: UserService
  ) {}

  async create(article: CreateArticleDto): Promise<ArticleResponseDto> {
    const newArticle = this.articleRepository.create({
      title: article.title,
      description: article.description,
      author: await this.userService.findOne(article.authorId)
    });
    return await this.articleRepository.save(newArticle);
  }

  async read(id: string): Promise<ArticleResponseWithIdDto> {
    return await this.articleRepository.findOneOrFail({
      where: { uuid: id },
      relations: ['author']
    });
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
    return article;
  }

  async remove(id: string): Promise<void> {
    await this.articleRepository.delete({ uuid: id })
  }
}
