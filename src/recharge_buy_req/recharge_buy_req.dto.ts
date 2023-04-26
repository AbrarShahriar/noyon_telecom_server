import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateRechargeBuyReqDto {
  @IsNotEmpty()
  @IsString()
  @Length(11)
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;
}

export class UpdateRechargeBuyReqApprovedDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  approved: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rechargeBuyReqId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  moderatorId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty()
  approvedBy?: string;
}

export class RejectReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rechargeBuyReqId: number;
}
