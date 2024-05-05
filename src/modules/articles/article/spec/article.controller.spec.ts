import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from '../article.controller';
import { ArticleService } from '../article.service';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';

const article = {
  uuid: 'eaf5b3e6-0d9a-4011-b789-972f897fb541',
  title: 'Article name',
};

describe('ArticleController', () => {
  let controller: ArticleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{
        provide: ArticleService,
        useValue: {
          create: () => article,
          update: () => article,
          read: () => article,
          remove: jest.fn(),
        },
      }, {
        provide: JwtService,
        useValue: {
          decode: () => ({ sub: v4() }),
        },
      }],
    }).compile();

    controller = module.get(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return article in data', async () => {
      const result = await controller.create({} as any, '');
      expect(result.data).toStrictEqual(article);
    });
  });

  describe('update', () => {
    it('should return article in data', async () => {
      const result = await controller.update('', {} as any);
      expect(result.data).toStrictEqual(article);
    });
  });

  describe('delete', () => {
    it('should return undefined', async () => {
      const result = await controller.delete('');
      expect(result).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should return article in data', async () => {
      const result = await controller.findOne('');
      expect(result.data).toStrictEqual(article);
    });
  });
});
