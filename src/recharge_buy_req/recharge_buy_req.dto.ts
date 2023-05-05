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
  @IsString()
  @Length(11)
  @ApiProperty()
  sendTo: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;
}

export class UpdateRechargeBuyReqApprovedDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rechargeBuyReqId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  moderatorId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  actionByAdmin?: boolean;
}

export class RechargeRejectReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rechargeBuyReqId: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  moderatorId?: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  actionByAdmin?: boolean;
}
