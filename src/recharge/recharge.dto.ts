import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateRechargeDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  amount: number;
}
