import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class GetMetroArrivalDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public routeId!: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  public stationId!: number;

  @IsNotEmpty()
  @IsString()
  @Matches(/^1$|^2$/i)
  public inOutTag!: '1' | '2';
}
