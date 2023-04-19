import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Pin Number Has To Be 6 Character Long' })
  pin: string;
}

export class GetUserDto {
  @ApiProperty()
  name: string;
  phone: string;

  @Exclude()
  pin: string;

  constructor(partial: Partial<GetUserDto>) {
    Object.assign(this, partial);
  }
}
