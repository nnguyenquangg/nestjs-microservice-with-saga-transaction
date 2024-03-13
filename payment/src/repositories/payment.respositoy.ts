import { PaymentEntity } from 'src/entities/payment.entity';
import { EntityRepository } from 'typeorm';
@EntityRepository(PaymentEntity)
export class PaymentRepository {}
