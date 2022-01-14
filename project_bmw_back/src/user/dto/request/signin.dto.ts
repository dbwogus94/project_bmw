import { IsNotEmpty, IsString } from 'class-validator';
import { Dto } from '../dto.interface';

export class SigninDto implements Dto {
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;
}
