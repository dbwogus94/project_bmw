import { IsNotEmpty, IsString } from 'class-validator';
import { Dto } from './dto.interface';

export class RefreshDto implements Dto {
  @IsNotEmpty()
  @IsString()
  public username!: string;
}
