import { Scope } from 'typeorm-scope';

import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { Book } from '../books/book.entity';

@Scope<Invoice>([(qb, alias) => qb.andWhere(`${alias}.deletedAt IS NULL`)])
@Entity('invoices')
export class Invoice extends BaseEntity {
  @Column({ nullable: true })
  invoiceNo: string;

  @ManyToOne(() => Book, (model) => model.invoices)
  book: Book;

  @PrimaryColumn({ nullable: false })
  bookId: string;

  @Column({ nullable: true })
  sellQty: number;

  @Column({ nullable: true })
  sellPrice: number;

  @Column({ nullable: true })
  vat: number;

  @Column({ nullable: true })
  subTotal: number;

  @Column({ nullable: true })
  total: number;

  constructor() {
    super();
  }
}
