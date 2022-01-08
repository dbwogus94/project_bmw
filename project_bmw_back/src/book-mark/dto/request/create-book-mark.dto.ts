import { Dto } from '@user/dto/dto.interface';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

export class CreateBookMarkDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public bmGroupId!: number; // 그룹 id

  /* BookMark entity*/
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public routeId!: number; // 노선 Id

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationSeq!: number; // 경유 정류소 순번

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationId!: number; // 정류소 Id

  @IsNotEmpty()
  @Matches(/B|M/i)
  public label!: 'B' | 'M'; // 버스, 지하철 구분

  @IsNotEmpty()
  @IsString()
  @Type(type => String)
  @Transform(params => params.value.trim())
  public routeName!: string; // 노선 이름

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public stationName!: string; // 정류소 이름

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public direction!: string; // 노선 진행방향

  @IsNotEmpty()
  @Matches(/seoul|gyeonggi/i)
  public type!: 'seoul' | 'gyeonggi'; // api type

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public startStationName!: string; // 기점 정류소

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public endStationName!: string; // 종점 정류소

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public routeTypeCd!: number; // 노선 종류코드

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public routeTypeName!: string; // 노선 종류이름

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public regionName!: string; // 노선 운행지역명

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public districtCd!: number; // 관할지역코드

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim())
  public districtName!: string; // 관할지역명

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public minTerm!: number; // 최소배차

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public maxTerm!: number; // 최대배차

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  public companyId!: number; // 운수회사 id

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 운수회사명
  public companyName!: string;

  @IsOptional()
  @IsString()
  @Transform(params => params.value.trim()) // 운수회사 번호
  public companyTel!: string;
}
