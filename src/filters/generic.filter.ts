import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

function toNumber(value: any): number {
  let result = Number(value);
  if (isNaN(result)) {
    return undefined;
  }
  return result;
}

export function valueToBoolean(value: any) {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (['true', 'on', 'yes', '1'].includes(value.toLowerCase())) {
    return true;
  }
  if (['false', 'off', 'no', '0'].includes(value.toLowerCase())) {
    return false;
  }
  return undefined;
}

@Exclude()
export class GenericFilter {
  @Expose()
  @ApiProperty()
  @Transform(({ value }) => toNumber(value))
  @Min(1)
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  page: number;

  @Expose()
  @ApiProperty()
  @Transform(({ value }) => toNumber(value))
  @Min(1)
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  pageSize: number;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderBy?: string;

  @Expose()
  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}

@Exclude()
export class Generic {
  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => valueToBoolean(value))
  @IsBoolean()
  published?: boolean;
}

@Exclude()
export class QueryGeneric extends IntersectionType(GenericFilter, Generic) {}