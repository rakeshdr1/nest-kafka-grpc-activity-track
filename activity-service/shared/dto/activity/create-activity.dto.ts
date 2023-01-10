import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateActivityRequest {
  readonly user?: string;

  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}
