import { Test, TestingModule } from '@nestjs/testing';
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
const articles = [
  publishedArticle,
  unpublishedArticle,
];

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(async () => {
    const externalProviders = [{
      provide: 'DATA_SOURCE',
      useValue: {
        queryResultCache: {
          getFromCache: ({ identifier }) => {
            if (identifier === 'articles_find_0_3') return {
              result: [articles, articles.length],
            };
          },
          storeInCache: jest.fn(),
          isExpired: jest.fn()
        }
      },
    }, {
      provide: 'ARTICLE_REPOSITORY',
      useValue: {
        findAndCount: () => [articles, articles.length],
        metadata: () => {
          return {
            propertiesMap: {}
          }
        }
      },
    }];
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService, ...externalProviders],
    }).compile();

    service = module.get(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return articles in articles property', async () => {
      const result = await service.findAll({
        authorId: '1',
        published: true,
        page: 1,
        pageSize: 5,
      } as any);
      expect(result.articles).toStrictEqual(articles);
    });

    it('should return articles from cache', async () => {
      const result = await service.findAll({
        page: 1,
        pageSize: 3,
      } as any);
      expect(result.articles).toStrictEqual(articles);
    });
  });
});
