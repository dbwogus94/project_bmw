import { Dto } from '@user/dto/dto.interface';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetArrialInfoDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public routeId!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationSeq!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationId!: number;

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 위생화
  public type!: string;
}
