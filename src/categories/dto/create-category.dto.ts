import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  type_category: string; // O tipo da categoria, como 'Ficção Científica', 'Drama', etc.
}
