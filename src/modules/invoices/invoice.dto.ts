import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class InvoiceDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Invoice Number is required' })
  invoiceNo: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Book ID is required' })
  bookId: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Quantity is required' })
  sellQty: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty({ message: 'Vat is required' })
  @IsNumber()
  vat: number;
}
