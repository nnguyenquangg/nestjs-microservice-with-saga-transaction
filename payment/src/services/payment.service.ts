import { PaymentEntity } from 'src/entities/payment.entity';
import { DataSource } from 'typeorm';

export class PaymentService {
  constructor(private dataSource: DataSource) {}

  async authorizePayment(request: {
    orderId: number;
    amount: number;
  }): Promise<{ authorized: boolean }> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const paymentRepo = queryRunner.manager.getRepository(PaymentEntity);

      const payment: PaymentEntity = {
        orderId: request.orderId,
        amount: request.amount,
        status: 'AUTHORIZED',
        paymentDate: new Date(),
      };
      await paymentRepo.save(payment);

      await queryRunner.commitTransaction();

      return { authorized: true };
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async refund(request: { orderId: number; amount: number }): Promise<void> {
    // call third party payment provider

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const paymentRepo = queryRunner.manager.getRepository(PaymentEntity);

      await queryRunner.manager.query(
        'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE',
      );

      const payment = await paymentRepo.findOne({
        where: { orderId: request.orderId },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      await paymentRepo.update(payment.id, { status: 'CANCELED' });

      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
