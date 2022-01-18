import { Dto } from '@user/dto/dto.interface';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class SearchBusDto implements Dto {
  @IsNotEmpty()
  @IsString()
  @Transform(params => params.value.trim()) // 위생화
  @MaxLength(10)
  // @Matches(/^[0-9a-z-]{0,10}$/i) // 정규식에 일치해야 통과
  public routeName!: string;
}
