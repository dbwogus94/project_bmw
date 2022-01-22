import { Dto } from '@user/dto/dto.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateMetroStationDto implements Dto {
  @IsNotEmpty()
  stationName!: string;

  @IsNotEmpty()
  stationCd!: string; // 지하철 역 코드

  @IsNotEmpty()
  stationFrCode!: string; // 지하철 역 외부 코드

  @IsNotEmpty()
  @Type(() => Number)
  stationSeq!: number;
}
