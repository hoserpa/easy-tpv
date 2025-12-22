import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateArticuloDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  familia_id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  price?: number;
}
