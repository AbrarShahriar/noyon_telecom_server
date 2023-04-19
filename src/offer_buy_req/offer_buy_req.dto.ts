import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOfferBuyReqDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  phone: string;

  @IsNotEmpty()
  @IsString()
  offerId: string;
}

export class UpdateOfferBuyReqApprovedDto {
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;

  @IsNotEmpty()
  @IsString()
  approvedBy: string;
}
