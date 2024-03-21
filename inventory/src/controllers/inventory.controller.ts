import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { InventoryService } from 'src/services/inventory.service';

export type CheckProductsAvailabilityMessage = {
  products: [
    {
      id: number;
      quantity: number;
    },
  ];
};

export type UpdateStockMessage = {
  products: [
    {
      id: number;
      quantity: number;
    },
  ];
};

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern('inventory.products.get')
  async checkProductAvailability(
    @Payload() message: CheckProductsAvailabilityMessage,
  ) {
    return {
      available: await this.inventoryService.checkProductAvailability(
        message.products.reduce(
          (result, { id, quantity }) => ({ ...result, [id]: quantity }),
          {},
        ),
      ),
    };
  }

  @MessagePattern('inventory.stock.reduce')
  reduceStockQuantity(@Payload() message: UpdateStockMessage) {
    console.info('Inventory Service: reduce stock quantity');
    // console.log((undefined as any).a);

    this.inventoryService.reduceStockQuantity(
      message.products.reduce(
        (result, { id, quantity }) => ({ ...result, [id]: quantity }),
        {},
      ),
    );
    return {
      success: true,
    };
  }

  @MessagePattern('inventory.stock.restock')
  restockQuantity(@Payload() message: UpdateStockMessage) {
    console.info('Inventory Service: restock quantity');

    this.inventoryService.restockQuantity(
      message.products.reduce(
        (result, { id, quantity }) => ({ ...result, [id]: quantity }),
        {},
      ),
    );

    return {
      success: true,
    };
  }
}
