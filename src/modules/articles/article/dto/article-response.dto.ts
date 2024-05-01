import { Exclude, Expose } from 'class-transformer';
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