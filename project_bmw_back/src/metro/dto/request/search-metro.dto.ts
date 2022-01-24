import { Dto } from '@user/dto/dto.interface';
import { IsOptional, IsString, Matches } from 'class-validator';

export class SearchMetroDto implements Dto {
  @IsOptional()
  @IsString()
  @Matches(/^stations$/i)
  public include!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[ㄱ-ㅎㅏ-ㅣ가-힣0-9a-z-]{0,10}$/i)
  public stationName!: string;
}
