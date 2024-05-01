import { Exclude, Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
  @Expose()
  @ApiPropertyOptional({ default: 'Tolya Ivanov'})
  @IsOptional()
  @IsString()
  name: string

  @Expose()
  @ApiPropertyOptional({ default: 'i.tolya@yandex.ru'})
  @IsOptional()
  @IsEmail()
  email: string
}
