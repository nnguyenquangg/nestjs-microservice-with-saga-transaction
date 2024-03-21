import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from 'src/controllers/order.controller';
import { OrderEntity } from 'src/entities/order.entity';
import { AuthorizePaymentStep } from 'src/sagas/steps/authorize-payment.step';
import { CheckProductsAvailabilityStep } from 'src/sagas/steps/check-product-availability.step';
import { ConfirmOrderStep } from 'src/sagas/steps/confirm-order.step';
import { UpdateStockStep } from 'src/sagas/steps/update-stock.step';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    private dataSource: DataSource,
    @Inject(CheckProductsAvailabilityStep)
    private checkProductsAvailabilityStep: CheckProductsAvailabilityStep,
    @Inject(AuthorizePaymentStep)
    private authorizePaymentStep: AuthorizePaymentStep,
    @Inject(ConfirmOrderStep) private confirmOrderStep: ConfirmOrderStep,
    @Inject(UpdateStockStep) private updateStockStep: UpdateStockStep,
  ) {}

  async createOrder(body: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const inventoryRepo = queryRunner.manager.getRepository(OrderEntity);
      const order = await inventoryRepo.save({
        customerId: body.customerId,
        items: body.items,
        orderDate: new Date(),
      });

      await this.checkProductsAvailabilityStep.invoke(order);
      await this.authorizePaymentStep.invoke(order);
      await this.confirmOrderStep.invoke(order);
      await this.updateStockStep.invoke(order);

      await queryRunner.commitTransaction();
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
