import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderSaga } from 'src/sagas/create-order.saga';
import { OrderService } from 'src/services/order.service';

export class CreateOrderItemDto {
  productId: number;
  quantity: number;
  totalPrice: number;
}

export class CreateOrderDto {
  customerId: number;
  items: CreateOrderItemDto[];
}

@Controller('orders')
export class OrderController {
  constructor(
    private createOrderSaga: CreateOrderSaga,
    private orderService: OrderService,
  ) {}

  @Post('with-transactions')
  withSagaPattern(@Body() body: CreateOrderDto) {
    return this.createOrderSaga.execute(body);
  }

  @Post('without-transactions')
  withoutSagaPattern(@Body() body: CreateOrderDto) {
    return this.orderService.createOrder(body);
  }
}
