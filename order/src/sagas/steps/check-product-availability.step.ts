import { Step } from './step';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderEntity } from 'src/entities/order.entity';

@Injectable()
export class CheckProductsAvailabilityStep extends Step<OrderEntity, void> {
  constructor(
    @Inject('inventory_client')
    private inventoryClient: ClientKafka,
  ) {
    super();
    this.name = 'Check Products Availability Step';
  }

  async invoke(order: OrderEntity): Promise<void> {
    const availableProducts = await lastValueFrom(
      this.inventoryClient.send('inventory.products.get', {
        products: order.items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      }),
    );

    console.log('availableProducts', availableProducts);

    if (!availableProducts.available) {
      throw new BadRequestException(
        `${order.items.map((item) => item.productId)} is not availbe`,
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  withCompensation(_params: OrderEntity): Promise<any> {
    return Promise.resolve();
  }

  async onModuleInit() {
    this.inventoryClient.subscribeToResponseOf('inventory.products.get');
    await this.inventoryClient.connect();
  }
}
