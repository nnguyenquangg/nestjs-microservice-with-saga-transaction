import { Injectable } from '@nestjs/common';
import { InventoryEntity } from 'src/entities/inventory.entity';
import { DataSource, In } from 'typeorm';

@Injectable()
export class InventoryService {
  constructor(private dataSource: DataSource) {}

  async checkProductAvailability(request: {
    [id: number]: number;
  }): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.query(
        'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE',
      );

      const inventoryRepo = queryRunner.manager.getRepository(InventoryEntity);

      const products = await inventoryRepo.find({
        where: { id: In(Object.keys(request)) },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      await queryRunner.commitTransaction();

      return products.every((product) =>
        product.isStockSufficient(request[product.id]),
      );
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
