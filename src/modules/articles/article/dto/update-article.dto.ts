import { Exclude, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, Length } from 'class-validator';

@Exclude()
export class UpdateArticleDto {
  @Expose()
  @ApiPropertyOptional({ default: 'Simple title'})
  @IsOptional()
  @Length(10, 20)
  title: string;

  @Expose()
  @ApiPropertyOptional({ default: 'Simple description' })
  @IsOptional()
  @Length(10, 255)
  description: string;

  @Expose()
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  publish?: boolean;
}
