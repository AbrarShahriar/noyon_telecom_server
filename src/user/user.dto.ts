import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { Balance_Actions } from './user.enums';

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

export class VerifyPinDto {
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

export class UpdateUserBalanceDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ type: 'enum', enum: Balance_Actions })
  @IsNotEmpty()
  @IsEnum(Balance_Actions)
  balanceAction: Balance_Actions;
}
