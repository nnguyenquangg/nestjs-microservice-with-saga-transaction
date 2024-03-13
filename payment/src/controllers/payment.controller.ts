import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentService } from 'src/services/payment.service';

type AuthorizePaymentMessage = {
  orderId: number;
  amount: number;
};

@Controller()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @MessagePattern('payment.payment.authorize')
  authorizePayment(@Payload() message: AuthorizePaymentMessage) {
    console.info('Payment Service: authorize payment');

    return this.paymentService.authorizePayment(message);
  }

  @MessagePattern('payment.payment.refund')
  refund(@Payload() message: AuthorizePaymentMessage) {
    console.info('Payment Service: refund payment');

    return this.paymentService.refund(message);
  }
}
