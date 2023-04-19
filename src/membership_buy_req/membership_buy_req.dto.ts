import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { PaymentMethod } from 'src/shared/enums/enums';

export class CreateMembershipBuyReqDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  userPhone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

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
  transactionId: string;
}

export class UpdateMembershipBuyReqApprovedDto {
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;

  @IsNotEmpty()
  @IsString()
  moderatorId: number;

  @IsNotEmpty()
  @IsString()
  @Length(11)
  userPhone: string;
}
