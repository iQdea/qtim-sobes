import { GenericFilter, SortOrder } from '../../filters/generic.filter';
import { FindOptionsWhere, Repository } from 'typeorm';

export class PageService {
  protected createOrderQuery(filter: GenericFilter) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;
      return order;
    }

    order.createdAt = SortOrder.DESC;
    return order;
  }

  protected async paginate<T>(
    repository: Repository<T>,
    filter: GenericFilter,
    where: FindOptionsWhere<T>,
    relations?: string[]
  ) {
    return repository.findAndCount({
      order: this.createOrderQuery(filter),
      skip: (filter.page - 1) * (filter.pageSize),
      take: filter.pageSize,
      where: where,
      relations
    });
  }
}