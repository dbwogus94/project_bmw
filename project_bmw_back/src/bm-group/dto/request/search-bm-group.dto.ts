import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class SearchBmGroupDto {
  @ValidateIf((dto, v) => !!(dto.stationSeq || dto.stationId))
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  routeId!: number;

  @ValidateIf((dto, v) => !!(dto.routeId || dto.stationId))
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stationSeq!: number;

  @ValidateIf((dto, v) => !!(dto.routeId || dto.stationSeq))
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  stationId!: number;
}
