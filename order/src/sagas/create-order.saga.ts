import { Inject, Injectable } from '@nestjs/common';
import { PlaceOrderStep } from './steps/place-order.step';
import { Step } from './steps/step';
import { OrderEntity } from 'src/entities/order.entity';
import { CheckProductsAvailabilityStep } from './steps/check-product-availability.step';
import { AuthorizePaymentStep } from './steps/authorize-payment.step';
import { ConfirmOrderStep } from './steps/confirm-order.step';
import { UpdateStockStep } from './steps/update-stock.step';

@Injectable()
export class CreateOrderSaga {
  private steps: Step<OrderEntity, void>[] = [];

  constructor(
    @Inject(PlaceOrderStep) private step1: PlaceOrderStep,
    @Inject(CheckProductsAvailabilityStep)
    private step2: CheckProductsAvailabilityStep,
    @Inject(AuthorizePaymentStep) private step3: AuthorizePaymentStep,
    @Inject(ConfirmOrderStep) private step4: ConfirmOrderStep,
    @Inject(UpdateStockStep) private step5: UpdateStockStep,
  ) {
    this.steps = [this.step1, this.step2, this.step3, this.step4, this.step5];
  }

  async execute(order: OrderEntity) {
    const successfulSteps: Step<OrderEntity, void>[] = [];

    for (const step of this.steps) {
      try {
        console.info(`Invoking: ${step.name} ...`);
        await step.invoke(order);
        successfulSteps.unshift(step);
      } catch (error) {
        console.error(`Failed Step: ${step.name} !!`);
        successfulSteps.forEach(async (s) => {
          console.info(`Rollbacking: ${s.name} ...`);
          await s.withCompensation(order);
        });
        throw error;
      }
    }
    console.info('Order Creation Transaction ended successfully');
  }
}
