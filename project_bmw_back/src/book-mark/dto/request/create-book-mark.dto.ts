import { Dto } from '@user/dto/dto.interface';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateBookMarkDto implements Dto {
  @IsNotEmpty()
  @IsNumber()
  public bmGroupId!: number;

  @IsNotEmpty()
  @IsNumber()
  public routeId!: number; // 노선 Id

  @IsNotEmpty()
  @IsString()
  public routeName!: string; // 노선 이름

  @IsNotEmpty()
  @IsNumber()
  public stationSeq!: number; // 노선 경유 정류소 순번

  @IsNotEmpty()
  @IsNumber()
  public stationId!: number; // 정류소 Id

  @IsNotEmpty()
  @IsString()
  public stationName!: string; // 정류소 이름

  @IsNotEmpty()
  @Matches(/B|M/i)
  public label!: 'B' | 'M'; // 버스, 지하철 구분

  @IsNotEmpty()
  @IsString()
  public direction!: string; // 노선 진행 방향

  @IsNotEmpty()
  @IsString()
  public routeTypeName!: string; //노선 유형

  @IsNotEmpty()
  @Matches(/seoul|gyeonggi/i)
  public type!: 'seoul' | 'gyeonggi'; // api type
}
