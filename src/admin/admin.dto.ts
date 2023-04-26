import { IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from '../shared/enums/enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetReqsDto {
  id: number;
  title?: string;
  amount: number;
  userPhone: string;
  payment?: PaymentType;
}

interface PaymentType {
  paymentFrom: string;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
