import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @Column()
  amount: number;

  @Column()
  orderId: number;

  @Column()
  paymentDate: Date;

  @Column()
  status?: 'AUTHORIZED' | 'CANCELED';
}
