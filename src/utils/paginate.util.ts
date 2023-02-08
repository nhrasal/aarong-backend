import { FindManyOptions } from 'typeorm';

export function paginationOptions(options: any): FindManyOptions {
  const page = Number(options.page) ? Number(options.page) : 1;
  const take = Number(options.take) ? Number(options.take) : 100;
  const skip = page === 1 ? 0 : (page - 1) * take;

  const data: FindManyOptions = {
    take,
    skip,
  };

  return data;
}
