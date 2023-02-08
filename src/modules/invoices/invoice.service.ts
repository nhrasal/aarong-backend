import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/@responses/success.response';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { BookService } from '../books/book.service';
import { InvoiceDto } from './invoice.dto';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceService extends BaseService<Invoice> {
  constructor(
    @InjectRepository(Invoice)
    private readonly _repository: Repository<Invoice>,
    private readonly bookService: BookService,
  ) {
    super(_repository);
  }
  async getInvoices(): Promise<any> {
    const invoices = await this._repository.findAndCount({
      relations: ['book'],
    });
    if (!invoices[0]?.length) throw new NotFoundException('No invoices found!');
    // return invoices;
    return await invoices[0].map((invoice: any) => {
      return {
        id: invoice.id || '',
        code: invoice?.book?.code || '',
        name: invoice?.book?.name || '',
        category: invoice?.book?.category || '',
        writer: invoice?.book?.writer || '',
        publisher: invoice?.book?.publisher || '',
        sellQty: invoice.sellQty || 0,
        sellPrice: invoice.sellPrice || 0,
        vat: +invoice.vat || 0,
        total: +invoice.total || 0,
      };
    });
  }

  async storeInvoice(requestData: InvoiceDto): Promise<any> {
    // return requestData;
    const bookId = requestData?.bookId || null;
    const findBook = await this.bookService.findSingle(bookId);
    // return findBook;
    if (!findBook) throw new NotFoundException('Book not found!');
    if (+requestData.sellQty > +findBook.qty)
      throw new BadRequestException('Quantity not Available!');
    try {
      const sellPrice = +findBook.sellPrice || 0;
      const sellQty = +requestData.sellQty || 0;
      const vat = +requestData.vat || 0;
      const data: any = {
        book: findBook,
        sellPrice: sellPrice || 0.0,
        sellQty: sellQty || 0,
        vat: vat,
        subTotal: sellPrice * sellQty || 0,
        total: sellPrice * sellQty + vat,
      };
      //   return data;
      const storeInvoice = await this._repository.save(data);
      if (storeInvoice)
        return new SuccessResponse({
          message: 'Invoice generated!',
          payload: {},
        });
      throw new BadRequestException('Invoice is not generated!');
    } catch (err) {
      return err;
    }
  }
}
