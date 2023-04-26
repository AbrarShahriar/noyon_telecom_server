import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserHistoryType } from './user_history.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserHistoryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsEnum(UserHistoryType)
  @ApiProperty({ enum: UserHistoryType })
  historyType: UserHistoryType;

  @IsString()
  @IsOptional()
  @ApiProperty()
  desc?: string | undefined;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  reqId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  saved?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  transactionId?: string;
}
