import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Pin Number Has To Be 6 Character Long' })
  pin: string;
}

export class GetUserDto {
  name: string;
  phone: string;

  @Exclude()
  pin: string;

  constructor(partial: Partial<GetUserDto>) {
    Object.assign(this, partial);
  }
}
