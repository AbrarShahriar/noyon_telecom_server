import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateOfferBuyReqDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  offerId: number;
}

export class RejectReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  offerBuyReqId?: number;
}

export class UpdateOfferBuyReqApprovedDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  approved: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  offerBuyReqId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  moderatorId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  approvedBy: string;
}
