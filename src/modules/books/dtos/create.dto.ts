import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Book Code is required' })
  code: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Book Name is required' })
  name: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Writer is required' })
  writer: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'publisher is required' })
  publisher: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber()
  qty: number;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Purchase Price is required' })
  purchasePrice: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Selling price is required!' })
  sellPrice: string;
}
