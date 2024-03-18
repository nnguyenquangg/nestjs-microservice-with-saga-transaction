import { Injectable } from '@nestjs/common';
import { Step } from './step';
import { OrderEntity } from 'src/entities/order.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PlaceOrderStep extends Step<OrderEntity, void> {
  constructor(private dataSource: DataSource) {
    super();
    this.name = 'Place Order Step';
  }

  async invoke(order: OrderEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const orderRepo = queryRunner.manager.getRepository(OrderEntity);
    await orderRepo.save({ ...order });
  }

  async withCompensation(order: OrderEntity): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    const orderRepo = queryRunner.manager.getRepository(OrderEntity);
    await orderRepo.save({ ...order, status: 'CANCELLED' });
  }
}
