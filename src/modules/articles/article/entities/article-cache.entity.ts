import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  schema: 'public',
  name: 'article-cache'
})
export class ArticleCache {
  @PrimaryColumn()
  key: string;
}
