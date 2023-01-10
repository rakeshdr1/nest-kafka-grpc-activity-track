import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { CreateActivityRequest } from './create-activity.dto';

export class UpdateActivityRequest extends PartialType(
  OmitType(CreateActivityRequest, ['user'] as const),
) {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
