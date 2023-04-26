import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAdminSettingsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  label: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  value: string;
}
