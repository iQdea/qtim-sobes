import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from '../article.service';
import { UserService } from '../../../users/user/user.service';

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

describe('ArticleService', () => {
  let service: ArticleService;

  beforeEach(async () => {
    const externalProviders = [{
      provide: 'DATA_SOURCE',
      useValue: {
        queryResultCache: {
          getFromCache: ({ identifier }) => {
            const result = articles.find(
              ({ uuid }) => identifier === `article_find_${uuid}` &&
                cachedArticle.uuid === uuid,
            );

            if (result) return { result };
          },
          storeInCache: jest.fn(),
          remove: jest.fn(),
          findAll: () => [],
          isExpired: jest.fn()
        }
      },
    }, {
      provide: 'ARTICLE_REPOSITORY',
      useValue: {
        create: jest.fn(),
        save: () => unpublishedArticle,
        findOneOrFail: ({ where: { uuid } }) => articles.find(
          (article) => article.uuid === uuid,
        ) || unpublishedArticle,
        update: jest.fn(),
        delete: jest.fn(),
      },
    }, {
      provide: UserService,
      useValue: {
        findOne: jest.fn(),
      },
    }];

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleService, ...externalProviders],
    }).compile();

    service = module.get(ArticleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return article', async () => {
      const result = await service.create({} as any, '');
      expect(result).toStrictEqual(unpublishedArticle);
    });
  });

  describe('read', () => {
    it('should return article', async () => {
      const result = await service.read(unpublishedArticle.uuid);
      expect(result).toStrictEqual(unpublishedArticle);
    });

    it('should return cached article', async () => {
      const result = await service.read(cachedArticle.uuid);
      expect(result).toStrictEqual(cachedArticle);
    });
  });

  describe('update', () => {
    it('should return article', async () => {
      const result = await service.update('', {} as any);
      expect(result).toStrictEqual(unpublishedArticle);
    });

    it('should not publish article', async () => {
      const result = service.update(publishedArticle.uuid, {
        publish: true,
      } as any);

      await expect(result)
        .rejects
        .toThrow('Cannot publish already published article');
    });

    it('should not unpublish article', async () => {
      const result = service.update(unpublishedArticle.uuid, {
        publish: false,
      } as any);

      await expect(result)
        .rejects
        .toThrow('Cannot unpublish not published article');
    });
  });

  describe('remove', () => {
    it('should return undefined', async () => {
      const result = await service.remove('');
      expect(result).toBeUndefined();
    });
  });
});
