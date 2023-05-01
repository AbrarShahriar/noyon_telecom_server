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

export class OfferRejectReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  offerBuyReqId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  moderatorId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  actionByAdmin: boolean;
}

export class UpdateOfferBuyReqApprovedDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  offerBuyReqId?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  moderatorId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  actionByAdmin: boolean;
}
