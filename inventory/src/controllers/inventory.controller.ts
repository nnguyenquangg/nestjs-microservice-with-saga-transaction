import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { InventoryService } from 'src/services/inventory.service';

type CheckProductsAvailabilityMessage = {
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
  checkProductAvailability(
    @Payload() message: CheckProductsAvailabilityMessage,
  ) {
    return {
      available: this.inventoryService.checkProductAvailability(
        message.products.reduce(
          (result, { id, quantity }) => ({ ...result, [id]: quantity }),
          {},
        ),
      ),
    };
  }
}
