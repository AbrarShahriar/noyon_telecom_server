import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OfferCategory, OfferType, SIMCARD } from './offer.enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOfferDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  desc?: string;

  @IsNotEmpty()
  @IsEnum(OfferCategory)
  @ApiProperty({ type: 'enum', enum: OfferCategory })
  category: OfferCategory;

  @IsNotEmpty()
  @IsEnum(SIMCARD)
  @ApiProperty({ type: 'enum', enum: SIMCARD })
  simcard: SIMCARD;

  @IsNotEmpty()
  @IsEnum(OfferType)
  @ApiProperty({ type: 'enum', enum: OfferType })
  type: OfferType;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isPremium: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  regularPrice: number;

  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  @ApiProperty()
  discountPrice: number;

  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  @ApiProperty()
  adminPrice: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  expiration: string;
}

export class UpdateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  adminPrice?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  discountPrice?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  regularPrice?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  showOffer?: boolean;
}
