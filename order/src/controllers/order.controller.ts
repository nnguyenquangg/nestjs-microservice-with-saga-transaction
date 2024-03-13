import { Controller, Post } from '@nestjs/common';
import { OrderService } from 'src/services/order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('with-transactions')
  orderWithTransaction() {}

  @Post('')
  orderWithoutTransaction() {}
}
