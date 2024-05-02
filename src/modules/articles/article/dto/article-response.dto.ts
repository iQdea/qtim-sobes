import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Nested } from '@qdea/swagger-serializer';
import { UserResponseWithIdDto } from '../../../users/user/dto/user-response.dto';

@Exclude()
export class ArticleResponseDto{
  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  @Nested(UserResponseWithIdDto)
  author: UserResponseWithIdDto

  @Expose()
  @ApiProperty()
  publishedAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

@Exclude()
export class ArticleResponseWithIdDto extends ArticleResponseDto {
  @Expose()
  @ApiProperty()
  uuid: string;
}

@Exclude()
export class PaginationMeta {
  @Expose()
  @ApiProperty()
  itemCount: number

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  currentPage: number

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => parseInt(value))
  itemsPerPage: number
}


@Exclude()
export class PaginationArticleResponse {
  @Expose()
  @ApiProperty()
  @Nested(ArticleResponseWithIdDto, true)
  articles: ArticleResponseWithIdDto[]

  @Expose()
  @ApiProperty()
  @Nested(PaginationMeta)
  meta: PaginationMeta
}