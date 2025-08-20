import { ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'Título do livro',
    example: 'O Senhor dos Anéis',
  })

  @IsString()
  @IsNotEmpty()
  titulo!: string;

  @ApiProperty({
    description: 'Autor do livro',
    example: 'J.R.R. Tolkien',
  })
  @IsString()
  @IsNotEmpty()
  autor!: string;

  @ApiProperty({
    description: 'Data de publicação do livro',
    example: '1954-07-29',
  })
  @IsDateString()
  @IsOptional()
  dataPublicacao?: string;

  @ApiProperty({
    description: 'Categoria do livro',
    example: 'Fantasia',
  })
  @IsString()
  @IsOptional()
  categoria?: string;
}