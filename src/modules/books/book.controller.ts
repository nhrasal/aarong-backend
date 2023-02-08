import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/base.controller';
import { BookService } from './book.service';
import { BookDto } from './dtos/create.dto';

@ApiTags('Books')
@Controller('books')
export class BookController extends BaseController<BookDto, BookDto> {
  constructor(private readonly service: BookService) {
    super(service, []);
  }

  @Post()
  @ApiBody({ type: BookDto })
  @UsePipes(ValidationPipe)
  async createCustomer(@Body() data: BookDto): Promise<any> {
    return this.service.storeBook(data);
  }

  @Put(':id')
  @ApiBody({ type: BookDto })
  @UsePipes(ValidationPipe)
  async update(@Param('id') id: string, @Body() data: BookDto): Promise<any> {
    return this.service.updateBook(id, data);
  }
  @Delete(':id')
  async delete(@Param('id') id: string, @Body() data: BookDto): Promise<any> {
    return this.service.removeBook(id);
  }
}
