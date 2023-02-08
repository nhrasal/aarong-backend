import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllSuccessResponse } from 'src/@responses/findAllSuccess.response';
import { paginationOptions } from 'src/utils/paginate.util';
import { FindOneOptions, Raw, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<Entity> extends Repository<Entity> {
  repo: Repository<Entity>;
  entity: Entity;

  constructor(private repository: any) {
    super();
    this.repo = this.repository;
  }

  async findAllWithPaginate(options: any, relations?: string[]): Promise<any> {
    console.log('call from find All With Paginate');
    const searchTerm = options.searchTerm;
    const searchAttributes = options.searchAttributes || ['name'];
    delete options.searchAttributes;
    delete options.searchTerm;

    if (options.take && options.take === 'all') {
      delete options.take;
      delete options.page;
      let orWhere: any = { ...options };

      if (searchTerm) {
        orWhere = [];
        if (searchAttributes) {
          searchAttributes.map((item: string) => {
            const dd = { ...options };
            dd[item] = Raw((alias) => `${alias} ILIKE '%${searchTerm}%'`);

            orWhere.push(dd);
          });
        }
      }
      if (options.order) {
        options.order =
          typeof options.order === 'string'
            ? JSON.parse(options.order)
            : options.order;
      } else {
        options.order = { updatedAt: 'DESC' };
      }
      delete orWhere.order;
      options.where = orWhere;

      options.relations = relations;

      const payload = await this.repo.findAndCount(options);
      return new FindAllSuccessResponse({
        payload: payload[0],
        total: payload[1],
        take: 'all',
        page: false,
      });
    } else {
      const pOptions: any = paginationOptions(options);
      pOptions.page = options.page;
      delete options.page;
      delete options.take;

      let orWhere: any = { ...options };

      if (searchTerm) {
        orWhere = [];

        if (searchAttributes) {
          searchAttributes.map((item: string) => {
            const dd = { ...options };
            dd[item] = Raw((alias) => `${alias} ILIKE '%${searchTerm}%'`);

            orWhere.push(dd);
          });
        }
      }

      if (options.order) {
        options.order =
          typeof options.order === 'string'
            ? JSON.parse(options.order)
            : options.order;
      } else {
        options.order = { updatedAt: 'DESC' };
      }
      pOptions.order = options.order;

      delete orWhere.order;
      pOptions.where = orWhere;

      if (relations) {
        pOptions.relations = relations;
      }

      const payload = await this.repo.findAndCount(pOptions);

      return new FindAllSuccessResponse({
        payload: payload[0],
        total: payload[1],
        page: pOptions.page,
        take: pOptions.take,
      });
    }
  }
  async findById(id: string, relations?: string[]): Promise<any> {
    console.log('call from base service  : findById>>>>>>>>>>>>>>>>>>>>', id);
    // return await this.repo.findOne(id);

    const options: FindOneOptions = {};
    if (relations) {
      options.relations = relations;
    }
    const data = await this.repo.findOne(id, options);
    return data || new NotFoundException('no data found with this id');
  }
}
