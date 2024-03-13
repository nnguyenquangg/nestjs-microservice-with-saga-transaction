import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Step } from './step';
import { ClientKafka } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderEntity } from 'src/entities/order.entity';

@Injectable()
export class AuthorizePaymentStep extends Step<OrderEntity, void> {
  constructor(@Inject('payment_client') private paymentClient: ClientKafka) {
    super();
    this.name = 'Authorize Payment Step';
  }

  async invoke(order: OrderEntity): Promise<any> {
    const paymentAuthorization = await lastValueFrom(
      this.paymentClient.send('payment.payment.authorize', {
        orderId: order.id,
        amount: order.items.reduce((accumulator: number, item) => {
          return accumulator + item.totalPrice;
        }, 0),
      }),
    );

    if (!paymentAuthorization.authorized) {
      throw new BadRequestException('The payment unsuccessful');
    }
  }

  async withCompensation(order: OrderEntity): Promise<any> {
    await lastValueFrom(
      this.paymentClient.send('payment.payment.refund', {
        orderId: order.id,
        amount: order.items.reduce((accumulator: number, item) => {
          return accumulator + item.totalPrice;
        }, 0),
      }),
    );
  }

  async onModuleInit() {
    this.paymentClient.subscribeToResponseOf('payment.payment.authorize');
    this.paymentClient.subscribeToResponseOf('payment.payment.refund');

    await this.paymentClient.connect();
  }
}
