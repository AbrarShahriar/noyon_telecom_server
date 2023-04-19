import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateRechargeBuyReqDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class UpdateRechargeBuyReqApprovedDto {
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;

  @IsNotEmpty()
  @IsString()
  approvedBy: string;
}
