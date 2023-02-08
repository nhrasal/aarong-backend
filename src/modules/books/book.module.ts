import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { Book } from './book.entity';
import { BookService } from './book.service';

const ENTITIES = [Book];
const SERVICES = [BookService];
const CONTROLLERS = [BookController];
// const SUBSCRIBERS = [UserSubscriber];

@Module({
  imports: [TypeOrmModule.forFeature([...ENTITIES])],
  providers: [...SERVICES, ...CONTROLLERS],
  controllers: [...CONTROLLERS],
  exports: [...SERVICES, ...CONTROLLERS],
})
export class BookModule {}
