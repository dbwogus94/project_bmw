import { Dto } from '@user/dto/dto.interface';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class SearchStationDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number) // 형변환
  @IsNumber()
  public routeId!: number;

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 위생화
  @Matches(/^seoul$|^gyeonggi$/i)
  public type!: string;
}
