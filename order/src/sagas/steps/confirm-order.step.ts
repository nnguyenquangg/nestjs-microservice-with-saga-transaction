import { Injectable } from '@nestjs/common';
import { Step } from './step';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderRepository } from 'src/repositories/order.repository';

@Injectable()
export class ConfirmOrderStep extends Step<OrderEntity, void> {
  constructor(private orderRepository: OrderRepository) {
    super();
    this.name = 'Confirm Order Step';
  }

  invoke(order: OrderEntity): Promise<void> {
    order.status = 'CONFIRMED';
    this.orderRepository.save(order);
    return Promise.resolve();
  }

  withCompensation(order: OrderEntity): Promise<void> {
    order.status = 'CANCELLED';
    this.orderRepository.save(order);
    return Promise.resolve();
  }
}
