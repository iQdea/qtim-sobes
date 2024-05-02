import {
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  schema: 'public',
  name: 'cache-keys'
})
export class CacheKeys {
  @PrimaryColumn()
  key: string;
}
