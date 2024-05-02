import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from '../articles.controller';
import { ArticlesService } from '../articles.service';

const publishedArticle = {
  uuid: '1',
  title: 'Article name',
  publishedAt: new Date(),
};
const unpublishedArticle = {
  uuid: '2',
  title: 'Article name',
};
const cachedArticle = {
  uuid: '3',
  title: 'Article name',
};
const articles = [
  publishedArticle,
  unpublishedArticle,
  cachedArticle,
];

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{
        provide: ArticlesService,
        useValue: {
          findAll: () => articles,
        },
      }],
    }).compile();

    controller = module.get(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return articles in data', async () => {
      const result = await controller.findAll({
        page: 1,
        pageSize: 3,
      } as any);
      expect(result.data).toStrictEqual(articles);
    });
  });
});
