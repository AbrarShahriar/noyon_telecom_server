import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { OfferCategory, OfferType, SIMCARD } from './offer.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

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
  @IsString()
  @ApiProperty()
  expiration: string;
}
