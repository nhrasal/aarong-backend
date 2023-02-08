import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/base/base.controller';
import { InvoiceDto } from './invoice.dto';
import { InvoiceService } from './invoice.service';
@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController extends BaseController<InvoiceDto, InvoiceDto> {
  constructor(private readonly service: InvoiceService) {
    super(service, []);
  }
  @Get()
  async getInvoices(): Promise<any> {
    return this.service.getInvoices();
  }

  @Post()
  @ApiBody({ type: InvoiceDto })
  @UsePipes(ValidationPipe)
  async createCustomer(@Body() data: InvoiceDto): Promise<any> {
    return this.service.storeInvoice(data);
  }
}
