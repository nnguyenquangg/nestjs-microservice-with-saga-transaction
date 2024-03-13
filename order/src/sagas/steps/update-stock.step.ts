import { Step } from './step';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderEntity } from 'src/entities/order.entity';

@Injectable()
export class UpdateStockStep extends Step<OrderEntity, void> {
  constructor(
    @Inject('inventory_client')
    private inventoryClient: ClientKafka,
  ) {
    super();
    this.name = 'Update Stock Step';
  }

  async invoke(order: OrderEntity): Promise<void> {
    const stockUpdate = await lastValueFrom(
      this.inventoryClient.send('inventory.stock.reduce', {
        products: order.items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      }),
    );
    if (!stockUpdate.success) {
      throw new Error("Couldn't update stock");
    }
  }

  async withCompensation(order: OrderEntity): Promise<void> {
    const stockUpdate = await lastValueFrom(
      this.inventoryClient.send('inventory.stock.restock', {
        products: order.items.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
      }),
    );
    if (!stockUpdate.success) {
      throw new BadRequestException("Couldn't update stock");
    }
  }

  async onModuleInit() {
    this.inventoryClient.subscribeToResponseOf('inventory.stock.reduce');
    this.inventoryClient.subscribeToResponseOf('inventory.stock.restock');
    await this.inventoryClient.connect();
  }
}
