import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
import { PaymentMethod, ReqStatus } from 'src/shared/enums/enums';

export class CreateWithdrawReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  moderatorId: number;

  @IsNotEmpty()
  @IsNumber()
  @Max(1000)
  @ApiProperty()
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  paymentPhone: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;
}
export class UpdateWithdrawReqDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  reqId: number;

  @IsNotEmpty()
  @IsEnum(ReqStatus)
  @ApiProperty({ type: 'enum', enum: ReqStatus })
  reqStatus: ReqStatus;
}
