import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

@Exclude()
export class CreateArticleDto {
  @Expose()
  @ApiProperty({ default: 'Simple title'})
  @IsString()
  @Length(10, 20)
  title: string;

  @Expose()
  @ApiProperty({ default: 'Simple description' })
  @IsString()
  @Length(10, 255)
  description: string;
}
