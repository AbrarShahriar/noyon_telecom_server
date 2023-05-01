import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { PaymentMethod } from 'src/shared/enums/enums';

export class CreateMembershipBuyReqDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  @ApiProperty()
  userPhone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ enum: PaymentMethod })
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

export class MembershipRejectReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  membershipBuyReqId: number;
}

export class UpdateMembershipBuyReqApprovedDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  membershipBuyReqId: number;
}
