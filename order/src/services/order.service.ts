import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/repositories/order.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(private dataSource: DataSource) {}

  async order() {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const orderRepo = queryRunner.manager.getRepository(OrderRepository);

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
