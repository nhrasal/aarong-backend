import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/@responses/success.response';
import { BaseService } from 'src/base/base.service';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { BookDto } from './dtos/create.dto';

@Injectable()
export class BookService extends BaseService<Book> {
  constructor(
    @InjectRepository(Book)
    private readonly _repository: Repository<Book>,
  ) {
    super(_repository);
  }
  async storeBook(requestData: BookDto): Promise<any> {
    try {
      const store = await this._repository.save(requestData);
      if (store)
        return new SuccessResponse({
          message: 'Book Store Successfully',
          payload: store,
        });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  async updateBook(Id: string, requestData: BookDto): Promise<any> {
    if (!Id) throw new BadRequestException('Book Id required');
    const findBook = await this._repository.findOne(Id, {
      select: ['id'],
    });
    if (!findBook) throw new BadRequestException('Book not found');
    try {
      const store = this._repository.save({ id: Id, ...requestData });
      if (store)
        return new SuccessResponse({
          message: 'Book Update Successfully',
          payload: {},
        });

      throw new BadRequestException('Something went wrong');
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
  async removeBook(Id: string): Promise<any> {
    if (!Id) throw new BadRequestException('Book Id required');
    const findBook = await this._repository.findOne(Id, {
      select: ['id'],
    });
    if (!findBook) throw new NotFoundException('Book not found!');
    try {
      const softRemove = await this._repository.save({
        id: Id,
        ...{ deletedAt: new Date() },
      });
      if (softRemove)
        return new SuccessResponse({
          message: 'Book Update Successfully',
          payload: {},
        });
      throw new BadRequestException('Something went wrong');
    } catch (err) {
      throw new BadRequestException('something went wrong');
    }
  }
  async findSingle(id: string): Promise<any> {
    return this._repository.findOne(id, {
      select: ['id', 'qty', 'sellPrice'],
    });
  }
}
