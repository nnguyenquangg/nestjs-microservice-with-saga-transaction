import { Inject, Injectable } from '@nestjs/common';
import { Step } from './step';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderRepository } from 'src/repositories/order.repository';

@Injectable()
export class PlaceOrderStep extends Step<OrderEntity, void> {
  constructor(@Inject(OrderRepository) private orderRepo: OrderRepository) {
    super();
    this.name = 'Place Order Step';
  }

  invoke(order: OrderEntity): Promise<void> {
    this.orderRepo.save(order);
    return Promise.resolve();
  }

  withCompensation(order: OrderEntity): Promise<void> {
    order.status = 'cancelled';
    this.orderRepo.save(order);
    return Promise.resolve();
  }
}
