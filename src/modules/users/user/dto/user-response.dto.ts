import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  email: string;

  createdAt: Date;

  updatedAt: Date;
}

@Exclude()
export class UserResponseWithIdDto extends UserResponseDto {
  @Expose()
  @ApiProperty()
  uuid: string;
}