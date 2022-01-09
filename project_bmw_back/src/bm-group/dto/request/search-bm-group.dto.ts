import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';

export class SearchBmGroupDto {
  @IsOptional()
  @IsString()
  @Matches(/book-marks/i)
  public include!: string;

  @ValidateIf((dto, v) => !!(dto.stationSeq || dto.stationId))
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public routeId!: number;

  @ValidateIf((dto, v) => !!(dto.routeId || dto.stationId))
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationSeq!: number;

  @ValidateIf((dto, v) => !!(dto.routeId || dto.stationSeq))
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationId!: number;
}
