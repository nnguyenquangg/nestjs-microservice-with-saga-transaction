import { PaymentEntity } from 'src/entities/payment.entity';
import { EntityRepository, Repository } from 'typeorm';
@EntityRepository(PaymentEntity)
export class PaymentRepository extends Repository<PaymentEntity> {}
