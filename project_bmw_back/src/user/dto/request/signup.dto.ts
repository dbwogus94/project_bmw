import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Dto } from '../dto.interface';

export class SignupDto implements Dto {
  @IsNotEmpty()
  @IsString()
  public username!: string;

  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsNotEmpty()
  // @ValidateIf((dto, v) => dto.email !== '' && v !== '')
  @IsEmail()
  public email!: string;
}
