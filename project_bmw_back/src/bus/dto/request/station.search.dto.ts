import { Dto } from '@user/dto/dto.interface';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class StationDto implements Dto {
  @IsNotEmpty()
  @Type(() => Number) // 형변환
  @IsNumber()
  public routeId!: number;

  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 위생화
  // TODO: 특정값만 체크하는 기능 있는지 확인, 있으면 적용 ('seoul' | 'gyeonggi';)
  public type!: string;
}
