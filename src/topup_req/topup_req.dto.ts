import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { PaymentMethod } from 'src/shared/enums/enums';

export class TopupRejectReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  topupReqId: number;
}

export class CreateTopupReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @Length(11)
  @ApiProperty()
  userPhone: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  @Length(11)
  @ApiProperty()
  paymentPhone: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  transactionId: string;
}

export class TopupReqApprovedDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userPhone: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  approved: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  approvedBy: string;
}