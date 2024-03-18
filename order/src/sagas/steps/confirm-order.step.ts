import { Injectable } from '@nestjs/common';
import { Step } from './step';
import { OrderEntity } from 'src/entities/order.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ConfirmOrderStep extends Step<OrderEntity, void> {
  constructor(private dataSource: DataSource) {
    super();
    this.name = 'Confirm Order Step';
  }

  invoke(order: OrderEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const orderRepo = queryRunner.manager.getRepository(OrderEntity);
    order.status = 'CONFIRMED';
    orderRepo.save(order);
    return Promise.resolve();
  }

  withCompensation(order: OrderEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const orderRepo = queryRunner.manager.getRepository(OrderEntity);
    order.status = 'CANCELLED';
    orderRepo.save(order);
    return Promise.resolve();
  }
}
