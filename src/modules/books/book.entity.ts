import { Scope } from 'typeorm-scope';

import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { Invoice } from '../invoices/invoice.entity';

@Scope<Book>([(qb, alias) => qb.andWhere(`${alias}.deletedAt IS NULL`)])
@Entity('books')
export class Book extends BaseEntity {
  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  writer: string;

  @Column({ nullable: true })
  publisher: string;

  @Column({ nullable: true })
  qty: number;

  @Column({ nullable: true })
  purchasePrice: string;

  @Column({ nullable: true })
  sellPrice: string;

  @OneToMany(() => Invoice, (invoice) => invoice.bookId)
  invoices: Invoice[];

  constructor() {
    super();
  }
}
