import { Dto } from '@user/dto/dto.interface';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches, ValidateIf } from 'class-validator';

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

  @ValidateIf((params, v) => params.arsId == null && v == null)
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  @Transform(params => {
    return params.value === '' ? (params.value = '0') : params.value.trim();
  })
  public arsId!: string; // 경기도: 고유모바일번호(mobileNo) / 서울시: 정류소 고유번호(arsId), 서울시 지하철: 외부 코드(stationFrCode)

  @IsNotEmpty()
  @Matches(/^B$|^M$/i)
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
  @IsString()
  @Transform(params => (params.value !== '' ? params.value.trim() : '서울'))
  public regionName!: string; // 노선 운행지역명

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public districtCd!: number; // 관할지역코드

  @IsNotEmpty()
  @IsString()
  @Matches(/^1$|^2$/i)
  public inOutTag!: '1' | '2';

  @IsNotEmpty()
  @Matches(/^seoul$|^gyeonggi$|^data.seoul$/i)
  public type!: 'seoul' | 'gyeonggi' | 'data.seoul'; // api type
}
