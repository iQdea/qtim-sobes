import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Article } from './article/entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('ARTICLE_REPOSITORY') private articleRepository: Repository<Article>,
  ) {}

  async findAll() {
    return await this.articleRepository.find({
      relations: ['author']
    });
  }
}
