import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from './ENV';
import { BaseLogger } from './@logger/Base.logger';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './@interceptors/response.interceptor';
import { AllExceptionsFilter } from './@exceptions/AllExceptionsFilter';

import { BookModule } from './modules/books/book.module';
import { InvoiceModule } from './modules/invoices/invoice.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: ormConfig.type,
      host: ormConfig.host,
      port: ormConfig.port,
      username: ormConfig.username,
      password: ormConfig.password,
      database: ormConfig.database,
      autoLoadEntities: true,
      synchronize: true,
      autoReconnect: true,
    }),

    BookModule,
    InvoiceModule,
  ],

  // controllers: [AppController],
  // providers: [AppService],

  providers: [
    BaseLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
