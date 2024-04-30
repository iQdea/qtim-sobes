import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { UserService } from '../../users/user/user.service';

@Injectable()
export class ArticleService {
  constructor(
    @Inject('ARTICLE_REPOSITORY') private articleRepository: Repository<Article>,
    private readonly userService: UserService
  ) {}

  async create(article: CreateArticleDto) {
    const newArticle = this.articleRepository.create({
      title: article.title,
      description: article.description,
      author: await this.userService.findOne(article.authorId)
    });
    return await this.articleRepository.save(newArticle);
  }

  findAll() {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
