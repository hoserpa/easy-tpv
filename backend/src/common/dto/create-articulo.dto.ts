import { IsString, IsNotEmpty, IsNumber, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateArticuloDto {
  @IsNumber()
  @Min(1)
  family_id: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @IsNumber()
  @Min(0)
  @Max(999999.99)
  price: number;
}
