import { Dto } from '@src/user/dto/dto.interface';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearchStationDto implements Dto {
  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 위생화
  @MaxLength(20)
  public stationName!: string;
}
