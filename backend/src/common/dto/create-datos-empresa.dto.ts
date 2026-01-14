import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateDatosEmpresaDto {
  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(20)
  nif: string;

  @IsString()
  @MaxLength(255)
  address: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;
}
