import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModule } from '../books/book.module';
import { InvoiceController } from './invoice.conrtroller';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';

const ENTITIES = [Invoice];
const SERVICES = [InvoiceService];
const CONTROLLERS = [InvoiceController];
// const SUBSCRIBERS = [UserSubscriber];

@Module({
  imports: [
    TypeOrmModule.forFeature([...ENTITIES]),
    forwardRef(() => BookModule),
  ],
  providers: [...SERVICES, ...CONTROLLERS],
  controllers: [...CONTROLLERS],
  exports: [...SERVICES, ...CONTROLLERS],
})
export class InvoiceModule {}
