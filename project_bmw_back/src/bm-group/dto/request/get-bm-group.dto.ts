import { Dto } from '@user/dto/dto.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class GetBmGroupDto implements Dto {
  @IsOptional()
  @IsString()
  @Matches(/^book-marks$/i)
  public include!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public bmGroupId!: number;
}
